const { PrismaClient } = require("../prisma/generated/prisma-client-js/client");
const prisma = new PrismaClient();

async function getLeaders(req, res) {
  try {
    const top10leaders = await prisma.leader.findMany({
      orderBy: { timeSort: "asc" },
    });
    await prisma.$disconnect();
    return res.json(top10leaders);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function createLeader(req, res) {
  try {
    const { playerId, hours, minutes, seconds } = req.body;
    const twoDigitHours = hours < 10 ? `0${hours}` : hours;
    const twoDigitMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const twoDigitSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const time = `${twoDigitHours}:${twoDigitMinutes}:${twoDigitSeconds}`;
    const timeSort = Number(
      `${twoDigitHours}${twoDigitMinutes}${twoDigitSeconds}`
    );
    const leaders = await prisma.leader.findMany({
      orderBy: { timeSort: "asc" },
    });
    let leader = null;
    if (leaders.length < 10) {
      leader = await prisma.leader.create({
        data: { playerId, time, timeSort },
      });
    }
    if (leaders.length === 10) {
      const tenthLeader = leaders[leaders.length - 1];
      if (timeSort < tenthLeader.timeSort) {
        await prisma.leader.delete({ where: { id: tenthLeader.id } });
        leader = await prisma.leader.create({
          data: { playerId, time, timeSort },
        });
      }
    }
    await prisma.$disconnect();
    return res.json(leader);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

module.exports = { getLeaders, createLeader };
