import { prisma } from '@punch-it/shared/db';
import { resolveUniqueSlug, toSlug } from '@punch-it/shared/utils';

export class TeamRepository {
  async findAccessibleTeam(userId: string, teamId: string) {
    return prisma.team.findFirst({
      where: {
        id: teamId,
        deletedAt: null,
        members: {
          some: {
            userId,
            deletedAt: null,
          },
        },
      },
    });
  }

  async getOrCreateDefaultTeam(userId: string, displayName: string) {
    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        userId,
        deletedAt: null,
        team: { deletedAt: null },
      },
      include: { team: true },
      orderBy: { createdAt: 'asc' },
    });

    if (existingMembership) {
      return existingMembership.team;
    }

    const baseSlug = toSlug(`${displayName}-personal`) || `user-${userId.slice(0, 8)}`;
    const slug = await resolveUniqueSlug(baseSlug, async (candidate) => {
      const existing = await prisma.team.findFirst({
        where: { slug: candidate, deletedAt: null },
        select: { id: true },
      });
      return Boolean(existing);
    });

    return prisma.team.create({
      data: {
        name: `${displayName}'s Team`,
        slug,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
    });
  }
}

export const teamRepository = new TeamRepository();
