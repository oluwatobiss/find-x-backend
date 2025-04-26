const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createLeader(req, res) {
  const { playerId, hours, minutes, seconds } = req.body;

  console.log("=== createLeader ===");
  console.log({ playerId, hours, minutes, seconds });

  try {
    const leaders = await prisma.leader.findMany({ orderBy: { time: "asc" } });
    console.log(leaders);
    let leader = null;
    if (leaders.length < 10) {
      leader = await prisma.leader.create({
        data: { playerId, time: `${hours}:${minutes}:${seconds}` },
      });
    }
    await prisma.$disconnect();
    return res.json(leader);
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

module.exports = { createLeader };
