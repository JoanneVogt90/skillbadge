import hre from 'hardhat';

async function main() {
  const skillBadge = await hre.viem.deployContract('SkillBadge');

  console.log(`SkillBadge deployed to: ${skillBadge.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
