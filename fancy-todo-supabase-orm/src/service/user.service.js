
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const createUser = async (userData) => {
  try {
    // Periksa apakah ada pengguna dengan email, phone, atau name yang sama
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { phone: userData.phone },
          { name: userData.name }
        ]
      }
    });

    // Jika ada pengguna dengan email, phone, atau name yang sama, lempar kesalahan
    if (existingUser) {
      let errorMessage = '';
      if (existingUser.email === userData.email) {
        errorMessage += 'Email sudah terdaftar. ';
      }
      if (existingUser.phone === userData.phone) {
        errorMessage += 'Nomor telepon sudah terdaftar. ';
      }
      if (existingUser.name === userData.name) {
        errorMessage += 'Nama sudah terdaftar. ';
      }
      throw new Error(errorMessage);
    }

    // Jika tidak ada pengguna dengan email, phone, atau name yang sama, buat pengguna baru
    return await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      }
    });
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};


const getAllUsers = async () => {
  return prisma.user.findMany();
};

const getUserById = async (id) => {
  return prisma.user.findUnique({ where: { id } });
};

const updateUser = async (id, userData) => {
  return prisma.user.update({
    where: { id },
    data: userData,
  });
};

const deleteUser = async (id) => {
  return prisma.user.delete({ where: { id } });
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
