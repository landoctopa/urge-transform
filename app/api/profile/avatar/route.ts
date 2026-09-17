// app/api/profile/avatar/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getCurrentUser } from '@/lib/auth/currentUser';
import { createClient } from '@/utils/supabase/server';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
]);

const EXTENSIONS = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
} as const;

export async function POST(request: Request) {
  try {
    // --------------------------------------------------
    // 1. Require authenticated user
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 2. Read uploaded file
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 3. Validate file type
    // --------------------------------------------------

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Only PNG, JPEG, and WebP images are allowed.',
        },
        { status: 400 },
      );
    }

    // --------------------------------------------------
    // 4. Validate file size
    // --------------------------------------------------

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image must be 2 MB or smaller.',
        },
        { status: 400 },
      );
    }

    const extension = EXTENSIONS[
      file.type as keyof typeof EXTENSIONS
    ];

    if (!extension) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported image type.',
        },
        { status: 400 },
      );
    }

    // --------------------------------------------------
    // 5. Create Supabase client
    // --------------------------------------------------

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const userId = currentUser.auth.id;

    // One avatar per user.
    //
    // Example:
    // avatars/
    //   <user-id>/
    //     avatar.jpg
    //
    const avatarPath = `${userId}/avatar.${extension}`;

    // --------------------------------------------------
    // 6. Find existing avatar files
    //
    // We don't delete them yet.
    // The new upload must succeed first.
    // --------------------------------------------------

    const { data: existingFiles, error: listError } =
      await supabase.storage
        .from('avatars')
        .list(userId);

    if (listError) {
      console.error('Failed to list existing avatars:', listError);

      return NextResponse.json(
        {
          success: false,
          error: 'Unable to update your profile photo.',
        },
        { status: 500 },
      );
    }

    const existingAvatarPaths = (existingFiles ?? [])
      .filter((file) => file.name.startsWith('avatar.'))
      .map((file) => `${userId}/${file.name}`)
      .filter((path) => path !== avatarPath);

    // --------------------------------------------------
    // 7. Upload the new avatar
    // --------------------------------------------------

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(avatarPath, file, {
        contentType: file.type,
        upsert: true,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Avatar upload failed:', uploadError);

      return NextResponse.json(
        {
          success: false,
          error: 'Unable to upload your profile photo.',
        },
        { status: 500 },
      );
    }

    // --------------------------------------------------
    // 8. Get the public URL
    // --------------------------------------------------

    const {
      data: { publicUrl },
    } = supabase.storage
      .from('avatars')
      .getPublicUrl(avatarPath);

    if (!publicUrl) {
      // The upload succeeded, but we couldn't generate
      // the URL. Try to clean up the newly uploaded file.
      await supabase.storage
        .from('avatars')
        .remove([avatarPath]);

      return NextResponse.json(
        {
          success: false,
          error: 'Unable to create your profile photo URL.',
        },
        { status: 500 },
      );
    }

    // --------------------------------------------------
    // 9. Update the user's profile
    // --------------------------------------------------

    const { error: profileError } = await supabase
      .from('user_profile')
      .update({
        avatar_url: publicUrl,
      })
      .eq('user_id', userId);

    if (profileError) {
      console.error(
        'Failed to update profile avatar_url:',
        profileError,
      );

      // Roll back the newly uploaded file.
      await supabase.storage
        .from('avatars')
        .remove([avatarPath]);

      return NextResponse.json(
        {
          success: false,
          error: 'Unable to save your profile photo.',
        },
        { status: 500 },
      );
    }

    // --------------------------------------------------
    // 10. Remove old avatar files
    //
    // This happens only after the profile successfully
    // points to the new avatar.
    // --------------------------------------------------

    if (existingAvatarPaths.length > 0) {
      const { error: removeError } = await supabase.storage
        .from('avatars')
        .remove(existingAvatarPaths);

      if (removeError) {
        // Don't fail the request here.
        //
        // The profile already points to the correct new
        // avatar. Old files are only cleanup.
        console.error(
          'Failed to remove old avatar files:',
          removeError,
        );
      }
    }

    // --------------------------------------------------
    // 11. Return the new public URL
    // --------------------------------------------------

    return NextResponse.json({
      success: true,
      avatarUrl: publicUrl,
    });
  } catch (error) {
    console.error('Avatar upload route failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong while uploading your profile photo.',
      },
      { status: 500 },
    );
  }
}