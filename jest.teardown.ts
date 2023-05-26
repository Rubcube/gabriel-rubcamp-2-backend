import prisma from './src/infrastructure/prisma/client'

export default async () => {
	await prisma.internalTransfer.deleteMany()
	await Promise.all([prisma.account.deleteMany(), prisma.address.deleteMany()])
	await prisma.user.deleteMany()
}
