export default {
  general: {
    success: {
      code: 'SUCCESS',
      message: 'SUCCESS.',
    },
    empty_token: 'Kode Token tidak ada.',
    invalid_token: 'Kode Token tidak valid.',
    dataInvalid: {
      code: 'DATA_INVALID',
      message: 'Data tidak valid.',
    },
    dataNotFound: {
      code: 'DATA_NOT_FOUND',
      message: 'Data tidak ditemukan.',
    },
    emailExist: {
      code: 'EMAIL_ALREADY_EXISTS',
      message: 'Email sudah digunakan.',
    },
    emailNotFound: {
      code: 'EMAIL_NOT_FOUND',
      message: 'Email tidak ditemukan.',
    },
    empty_photo: {
      code: 'IMAGE_NOT_FOUND',
      message: 'File image kosong.',
    },
    failedDeleteData: {
      code: 'FAILED_DELETE_DATA',
      message: 'Gagal Hapus data.',
    },
    failedFetchData: {
      code: 'FAILED_FETCH_DATA',
      message: 'Gagal Ambil data.',
    },
    failedSaveData: {
      code: 'FAILED_SAVED_DATA',
      message: 'Gagal Simpan data.',
    },
    failedTransaction: {
      code: 'TRANSACTION_FAILED',
      message: 'Transaksi Gagal',
    },
    failedUpdateData: {
      code: 'FAILED_UPDATE_DATA',
      message: 'Gagal Update data.',
    },
    idNotFound: {
      code: 'INVALID_ID',
      message: 'ID tidak ditemukan.',
    },
    inactiveStatus: {
      code: 'INACTIVE_STATUS',
      message: 'Status tidak aktif.',
    },
    invalidID: {
      code: 'INVALID_ID',
      message: 'ID tidak valid.',
    },
    invalidUserAccess: {
      code: 'UNAUTHORIZED USER',
      message: 'User tidak mendapatkan akses.',
    },
    invalidUUID: {
      code: 'INVALID_UUID',
      message: 'UUID tidak valid.',
    },
    invalidValue: {
      code: 'INVALID_VALUE',
      message: 'Value tidak sesuai.',
    },
    nameExist: {
      code: 'NAME_ALREADY_EXISTS',
      message: 'Nama sudah digunakan.',
    },
    overLimit: {
      code: 'OVER_LIMIT',
      message: 'Value melebihi batas maksimum.',
    },
    phoneExist: {
      code: 'PHONE_ALREADY_EXISTS',
      message: 'Nomor Telepon sudah digunakan.',
    },
    phoneNotFound: {
      code: 'PHONE_NOT_FOUND',
      message: 'Nomer telepon tidak ditemukan.',
    },
    storeIdNotMatch: {
      code: 'STORE_ID_NOT_MATCH',
      message: 'Store ID bukan milik merchant.',
    },
    unauthorizedUser: {
      code: 'USER_UNAUTHORIZED',
      message: 'User tidak mendapatkan akses.',
    },
    underLimit: {
      code: 'UNDER_LIMIT',
      message: 'Value di bawah batas minimum.',
    },
    unpermittedPlatform: {
      code: 'PLATFORM_UNPERMITTED',
      message: 'Platform tidak diijinkan.',
    },
    unverificatedUser: {
      code: 'USER_NOT_VERIFIED',
      message: 'User belum terverifikasi.',
    },
    unverifiedEmail: {
      code: 'EMAIL_NOT_VERIFIED',
      message: 'Email belum terverifikasi.',
    },
    unverifiedPhone: {
      code: 'PHONE_NOT_VERIFIED',
      message: 'Nomer telepon belum terverifikasi.',
    },
  },
  creategroup: {
    success: 'SUCCESS',
    fail: 'Create Group Gagal.',
    phoneExist: 'Nomor telepon sudah digunakan oleh Group lain',
    emailExist: 'Email sudah digunakan oleh Group lain',
    invalid_token: 'Kode Token tidak valid.',
    empty_token: 'Kode Token tidak ada.',
    empty_photo: 'File photo kosong.',
  },
  updategroup: {
    success: 'Update Group Success.',
    fail: 'Update Group Gagal.',
    phoneUnreg: 'Nomor Telepon Pemilik tidak terdaftar',
    unreg: 'ID Group tidak valid.',
    empty_token: 'Kode Token tidak ada.',
  },
  deletegroup: {
    success: 'Delete Group Success.',
    fail: 'Delete Group Gagal.',
    phoneUnreg: 'Nomor Telepon Pemilik tidak terdaftar',
    empty_token: 'Kode Token tidak ada.',
    invalid_id: 'ID tidak valid.',
    merchant_active: 'Merchant masih aktif.',
  },
  listgroup: {
    success: 'Get List Group Success.',
    fail: 'Get List Group Gagal.',
    phoneUnreg: 'Nomor Telepon Pemilik tidak terdaftar',
    empty_token: 'Kode Token tidak ada.',
    query_fail: 'Akses ke database gagal',
  },
  createmerchant: {
    success: 'Create Merchant Success.',
    fail: 'Create Merchant Gagal.',
    phoneExist: {
      code: 'PHONE_ALREADY_REGISTERED',
      message: 'Nomor telepon sudah digunakan oleh Merchant lain',
    },
    emailExist: 'Email sudah digunakan oleh Merchant lain.',
    empty_token: 'Kode Token tidak ada.',
    invalid_token: 'Kode Token tidak valid.',
    groupid_notfound: 'ID Group tidak ditemukan.',
    lobid_notfound: 'ID bidang usaha tidak ditemukan.',
    bankid_notfound: 'ID Bank tidak ditemukan.',
    empty_photo: 'File photo kosong.',
    groupid_notactive: 'ID Group tidak aktif',
  },
  updatemerchant: {
    success: 'Update Merchant Success.',
    fail: 'Update Merchant Gagal.',
    phoneUnreg: 'Nomor Telepon Pemilik tidak terdaftar',
    empty_token: 'Kode Token tidak ada.',
    unreg: 'ID Merchant tidak valid.',
  },
  deletemerchant: {
    success: 'Delete Merchant Success.',
    fail: 'Delete Merchant Gagal.',
    phoneUnreg: 'Nomor Telepon Pemilik tidak terdaftar',
    invalid_id: 'ID tidak valid.',
  },
  listmerchant: {
    success: 'Get List Merchant Success.',
    fail: 'Get List Merchant Gagal.',
    phoneUnreg: 'Nomor Telepon Pemilik tidak terdaftar',
    empty_token: 'Kode Token tidak ada.',
  },
  createstore: {
    success: 'Create Store Success.',
    fail: 'Create Store Gagal.',
    phoneExist: 'Nomor telepon sudah digunakan oleh store lain',
    emailExist: 'Email sudah digunakan oleh store lain.',
    empty_token: 'Kode Token tidak ada.',
    merchantid_notfound: 'ID Merchant tidak ditemukan.',
    merchantid_notactive: 'ID Merchant tidak aktif',
    empty_photo: 'File photo kosong.',
    addonid_unreg: 'ID Addon tidak terdaftar.',
    store_category_not_found: {
      code: 'STORE_CATEGORY_NOT_FOUND',
      message: 'Category tidak ditemukan',
    },
  },
  updatestore: {
    success: 'Update Store Success.',
    fail: 'Update Store Gagal.',
    unreg: 'Nomor Telepon Pemilik tidak terdaftar',
    id_notfound: 'ID Store tidak ditemukan',
    empty_token: 'Kode Token tidak ada.',
    invalid_hour: {
      code: 'INVALID_HOUR',
      message: 'Jam tidak valid.',
    },
  },
  deletestore: {
    success: 'Delete Store Success.',
    fail: 'Delete Store Gagal.',
    unreg: 'Nomor Telepon Pemilik tidak terdaftar',
    empty_token: 'Kode Token tidak ada.',
    invalid_id: 'ID tidak valid.',
  },
  liststore: {
    success: 'Get List Store Success.',
    fail: 'Get List Store Gagal.',
    unreg: 'Nomor Telepon Pemilik tidak terdaftar',
    empty_token: 'Kode Token tidak ada.',
    not_found: {
      code: 'ISEMPTY',
      message: 'Store tidak ditemukan',
    },
  },
  createlob: {
    success: 'Create Bidang Usaha Success.',
    fail: 'Create Bidang Usaha Gagal.',
    nameExist: 'Nama Bidang Usaha sudah digunakan',
    invalid_token: 'Kode Token tidak valid.',
    empty_token: 'Kode Token tidak ada.',
  },
  updatelob: {
    success: 'Update Bidang Usaha Success.',
    fail: 'Update Bidang Usaha Gagal.',
    phoneUnreg: 'Nomor Telepon Pemilik tidak terdaftar',
    unreg: 'ID Bidang Usaha tidak valid.',
    empty_token: 'Kode Token tidak ada.',
  },
  deletelob: {
    success: 'Delete Bidang Usaha Success.',
    fail: 'Delete Bidang Usaha Gagal.',
    phoneUnreg: 'Nomor Telepon Pemilik tidak terdaftar',
    empty_token: 'Kode Token tidak ada.',
    invalid_id: 'ID tidak valid.',
  },
  listlob: {
    success: 'Get List Bidang Usaha Success.',
    fail: 'Get List Bidang Usaha Gagal.',
    phoneUnreg: 'Nomor Telepon Pemilik tidak terdaftar',
    empty_token: 'Kode Token tidak ada.',
  },
  listbank: {
    success: 'Get List Bank Success.',
    fail: 'Get List Bank Gagal.',
  },
  createaddon: {
    success: 'Create Addon Success.',
    fail: 'Create Addon Gagal.',
    nameExist: 'Nama Addon sudah digunakan',
    invalid_token: 'Kode Token tidak valid.',
    empty_token: 'Kode Token tidak ada.',
  },
  updateaddon: {
    success: 'Update Addon Success.',
    fail: 'Update Addon Gagal.',
    phoneUnreg: 'Nomor Telepon Pemilik tidak terdaftar',
    unreg: 'ID Addon tidak valid.',
    empty_token: 'Kode Token tidak ada.',
  },
  deleteaddon: {
    success: 'Delete Addon Success.',
    fail: 'Delete Addon Gagal.',
    phoneUnreg: 'Nomor Telepon Pemilik tidak terdaftar',
    empty_token: 'Kode Token tidak ada.',
    invalid_id: 'ID tidak valid.',
  },
  listaddon: {
    success: 'Get List Addon Success.',
    fail: 'Get List Addon Gagal.',
    phoneUnreg: 'Nomor Telepon Pemilik tidak terdaftar',
    empty_token: 'Kode Token tidak ada.',
  },
  login: {
    success: 'Login Success.',
    fail: 'Login Gagal.',
    phoneUnreg: 'Nomor Telepon Pemilik tidak terdaftar',
    empty_token: 'Kode Token tidak ada.',
    query_fail: 'Akses ke database gagal',
    invalid_email: 'Email tidak valid.',
    invalid_phone: 'Nomor Telepon tidak valid.',
    unregistered_phone: {
      code: 'UNREGISTERED_PHONE',
      message: 'No. handphone belum terdaftar. Daftar sebagai member?',
    },
    unregistered_email: {
      code: 'UNREGISTERED_EMAIL',
      message: 'Email belum terdaftar. Daftar sebagai member?',
    },
    invalid_password: {
      code: 'INVALID_PASSWORD',
      message: 'Password tidak valid',
    },
    waiting_approval: {
      code: 'WAITING_APPROVAL',
      message: 'User belum mendapatkan approval',
    },
  },
  user: {
    success: 'Ambil data Sukses.',
    unregistered_user: {
      code: 'UNREGISTERED_USER',
      message: 'User belum terdaftar.',
    },
  },
};
