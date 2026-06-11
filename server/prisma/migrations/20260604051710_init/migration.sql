-- CreateEnum
CREATE TYPE "TournamentType" AS ENUM ('CLUB', 'NATIONAL', 'INDIVIDUAL');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT[],
    "nationality" TEXT,
    "position" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "country" TEXT,
    "leagueId" TEXT,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "League" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "country" TEXT,

    CONSTRAINT "League_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "type" "TournamentType" NOT NULL DEFAULT 'CLUB',

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "nationality" TEXT,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerClub" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "fromYear" INTEGER,
    "toYear" INTEGER,

    CONSTRAINT "PlayerClub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerLeague" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,

    CONSTRAINT "PlayerLeague_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerManager" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "managerId" TEXT NOT NULL,

    CONSTRAINT "PlayerManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerTournament" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "year" INTEGER,

    CONSTRAINT "PlayerTournament_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Player_name_idx" ON "Player"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Club_tag_key" ON "Club"("tag");

-- CreateIndex
CREATE INDEX "Club_tag_idx" ON "Club"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "League_tag_key" ON "League"("tag");

-- CreateIndex
CREATE INDEX "League_tag_idx" ON "League"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_tag_key" ON "Tournament"("tag");

-- CreateIndex
CREATE INDEX "Tournament_tag_idx" ON "Tournament"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_tag_key" ON "Manager"("tag");

-- CreateIndex
CREATE INDEX "Manager_tag_idx" ON "Manager"("tag");

-- CreateIndex
CREATE INDEX "PlayerClub_playerId_idx" ON "PlayerClub"("playerId");

-- CreateIndex
CREATE INDEX "PlayerClub_clubId_idx" ON "PlayerClub"("clubId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerClub_playerId_clubId_key" ON "PlayerClub"("playerId", "clubId");

-- CreateIndex
CREATE INDEX "PlayerLeague_playerId_idx" ON "PlayerLeague"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerLeague_playerId_leagueId_key" ON "PlayerLeague"("playerId", "leagueId");

-- CreateIndex
CREATE INDEX "PlayerManager_playerId_idx" ON "PlayerManager"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerManager_playerId_managerId_key" ON "PlayerManager"("playerId", "managerId");

-- CreateIndex
CREATE INDEX "PlayerTournament_playerId_idx" ON "PlayerTournament"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerTournament_playerId_tournamentId_key" ON "PlayerTournament"("playerId", "tournamentId");

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerClub" ADD CONSTRAINT "PlayerClub_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerClub" ADD CONSTRAINT "PlayerClub_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerLeague" ADD CONSTRAINT "PlayerLeague_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerLeague" ADD CONSTRAINT "PlayerLeague_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerManager" ADD CONSTRAINT "PlayerManager_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerManager" ADD CONSTRAINT "PlayerManager_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerTournament" ADD CONSTRAINT "PlayerTournament_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerTournament" ADD CONSTRAINT "PlayerTournament_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;
