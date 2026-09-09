'use client';

import {
    setUserProfile,
    setUserProgress,
    setUserOpportunities,
    setUserProjects,
    setUserContacts,
    setUserCommitments,
    setUserTasks,
    setUserObservations,
} from '@/lib/program/stores';

import type { ProgramHydrationState } from './types';

export function hydrateProgramState(state: ProgramHydrationState): void {
    if (state.profile !== undefined) {
        if (state.profile !== null) {
            setUserProfile({
                id: state.profile.id,
                userId: state.profile.userId,
                capabilities: state.profile.capabilities,
                constraints: state.profile.constraints,
                desiredFuture: state.profile.desiredFuture,
                experience: state.profile.experience,
                fears: state.profile.fears,
                metadata: state.profile.metadata,
                motivations: state.profile.motivations,
                networkContext: state.profile.networkContext,
                perceivedBarriers: state.profile.perceivedBarriers,
                quitConditions: state.profile.quitConditions,
                resources: state.profile.resources,
                createdAt: state.profile.createdAt,
                updatedAt: state.profile.updatedAt,
                hydrated: true,
            });
        }
    }

    if (state.progress !== undefined) {
        const nodes = Object.fromEntries(state.progress.map(
            (item) => [
                item.nodeKey,
                item,
            ],
        ),
        );
        setUserProgress({
            nodes,
            hydrated: true,
            updatedAt: state.progress.reduce((latest, item,) =>
                item.updatedAt > latest ? item.updatedAt : latest, '',)
                || null,
        });
    }

    if (state.opportunities !== undefined) {
        setUserOpportunities(
            state.opportunities.map(
                (item) => ({
                    id: item.id,
                    userId: item.userId,
                    title: item.title,
                    description: item.description,
                    status: item.status,
                    source: item.source,
                    sourceNodeId: null,
                    problem: item.problem,
                    customer: item.customer,
                    hypothesis: item.hypothesis,
                    metadata: item.metadata,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                }),
            ),
        );
    }

    if (state.projects !== undefined) {
        setUserProjects(
            state.projects,
        );
    }

    if (state.contacts !== undefined) {
        setUserContacts(
            state.contacts.map(
                (item) => ({
                    id: item.id,
                    userId: item.userId,
                    name: item.name,
                    role: item.role,
                    organization: item.organization,
                    relationship: item.relationship,
                    context: item.context,
                    contactDetails: item.contactDetails,
                    sourceNodeId: null,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                }),
            ),
        );
    }

    if (state.commitments !== undefined) {
        setUserCommitments(
            state.commitments.map(
                (item) => ({
                    id: item.id,
                    userId: item.userId,
                    commitment: item.commitment,
                    reason: item.reason,
                    status: item.status,
                    sourceNodeId: null,
                    startsAt: item.startsAt,
                    dueAt: item.dueAt,
                    completedAt: item.completedAt,
                    metadata: item.metadata,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                }),
            ),
        );
    }

    if (state.tasks !== undefined) {
        setUserTasks(
            state.tasks.map(
                (item) => ({
                    id: item.id,
                    userId: item.userId,
                    title: item.title,
                    description: item.description,
                    status: item.status,
                    taskType: item.taskType,
                    sourceNodeId: null,
                    dueAt: item.dueAt,
                    completedAt: item.completedAt,
                    metadata: item.metadata,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                }),
            ),
        );
    }

    if (state.observations !== undefined) {
        setUserObservations(
            state.observations.map(
                (item) => ({
                    id: item.id,
                    userId: item.userId,
                    type: item.type,
                    title: item.title,
                    content: item.content,
                    sourceNodeId: null,
                    observedAt: item.observedAt,
                    metadata: item.metadata,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                }),
            ),
        );
    }
}