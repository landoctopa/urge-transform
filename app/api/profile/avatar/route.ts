import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getCurrentUser } from '@/lib/auth/currentUser';
import { createClient } from '@/utils/supabase/server';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
]);

const EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'You must be signed in.',
        },
        { status: 401 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please select an image.',
        },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Please upload a PNG, JPEG, or WebP image.',
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'Your profile picture must be 2 MB or smaller.',
        },
        { status: 400 },
      );
    }

    const extension = EXTENSIONS[file.type];

    if (!extension) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported image type.',
        },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const userId = currentUser.auth.id;

    const avatarPath =
      `${userId}/avatar.${extension}`;

    /*
     * Remove any existing avatar first.
     *
     * We use a fixed filename so replacing an avatar
     * doesn't create a collection of old profile pictures.
     */
    const { data: existingFiles } =
      await supabase.storage
        .from('avatars')
        .list(userId);

    if (existingFiles?.length) {
      const oldPaths = existingFiles
        .filter((item) =>
          item.name.startsWith('avatar.'),
        )
        .map(
          (item) =>
            `${userId}/${item.name}`,
        );

      if (oldPaths.length) {
        const { error: removeError } =
          await supabase.storage
            .from('avatars')
            .remove(oldPaths);

        if (removeError) {
          console.error(
            'Failed to remove previous avatar:',
            removeError,
          );
        }
      }
    }

    const { error: uploadError } =
      await supabase.storage
        .from('avatars')
        .upload(
          avatarPath,
          file,
          {
            contentType: file.type,
            upsert: true,
          },
        );

    if (uploadError) {
      console.error(
        'Avatar upload failed:',
        uploadError,
      );

      return NextResponse.json(
        {
          success: false,
          error: 'Unable to upload your profile picture.',
        },
        { status: 500 },
      );
    }

    const { error: profileError } =
      await supabase
        .from('user_profile')
        .update({
          avatar_path: avatarPath,
        })
        .eq('user_id', userId);

    if (profileError) {
      console.error(
        'Failed to save avatar path:',
        profileError,
      );

      /*
       * Clean up the uploaded file if the
       * profile update fails.
       */
      await supabase.storage
        .from('avatars')
        .remove([avatarPath]);

      return NextResponse.json(
        {
          success: false,
          error:
            'Your picture was uploaded but could not be saved to your profile.',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      avatarPath,
    });
  } catch (error) {
    console.error(
      'Avatar endpoint failed:',
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong while uploading your picture.',
      },
      { status: 500 },
    );
  }
}