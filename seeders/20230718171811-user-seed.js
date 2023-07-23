"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    Example: await queryInterface.bulkInsert(
      "user",
      [
        {
          santri_uuid: "c147d05e-4de3-446e-bae9-ca1fa37cea1b",
          santri_nama: "Sakinatul Fuada",
          blok_id: null,
          username: "sysadmin",
          password:
            "$2a$12$VfGQr3OEKb5yFCsmawj6vu73X9aYLwOEA1d7S91lEo6xs5lpRSpRO", //sysadmin
          role: "sysadmin",
          raw: JSON.stringify({
            uuid: "c147d05e-4de3-446e-bae9-ca1fa37cea1b",
            warganegara: "WNI",
            nokk: "3574022607100002",
            nik: "3574024807010001",
            no_passport: null,
            nama_lengkap: "Sakinatul Fuada",
            tempat_lahir: "Probolinggo",
            jenis_kelamin: "P",
            tanggal_lahir: "2001-07-08",
            umur: 22,
            anak_ke: 3,
            jum_saudara: 3,
            tinggal_bersama: "",
            id_jenjang_pendidikan: 3,
            jenjang_pendidikan: "Setingkat SMA",
            pendidikan_terakhir: "MA Nurul Jadid Paiton Probolinggo",
            phone1: "",
            phone2: "",
            email: "",
            id_pekerjaan: null,
            id_penghasilan: null,
            pekerjaan: null,
            penghasilan: null,
            jalan:
              "Jl. Amir Hamzah, Rt/rw 003/002, Kedung Asem, Wonoasih, Probolinggo",
            kodepos: "67236",
            wafat: "T",
            tanggal_wafat: null,
            updated_at: "2020-08-22T08:16:55.000Z",
            created_at: "2018-08-09T18:41:06.000Z",
            id_kecamatan: 3838,
            id_kabupaten: 260,
            kecamatan: "Wonoasih",
            kabupaten: "Kota Probolinggo",
            provinsi: "Jawa Timur",
            negara: "Indonesia",
            qrcode_url: "/qrcode/uuid/c147d05e-4de3-446e-bae9-ca1fa37cea1b.png",
            is_valid_nik: true,
            is_excluded_invalid_nik: false,
            warga_pesantren: {
              niup: "11720004181",
              aktif: "Y",
              qrcode_url: "/qrcode/niup/11720004181.png",
            },
            fotodiri: {
              normal:
                "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/09-28_3574024807010001_1601303118249_n.jpg",
              medium:
                "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/09-28_3574024807010001_1601303118249_m.jpg",
              small:
                "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/09-28_3574024807010001_1601303118249_s.jpg",
            },
            keluarga: [
              {
                id: 7948,
                uuid_person_lawan: "04ae409c-b6e7-43be-8309-acfac689470c",
                nama_lengkap: "Kholil Zaini",
                nokk: "3574022607100002",
                nik: "3574020808620003",
                no_passport: null,
                status_relasi: "Ayah kandung",
                kode_relasi: "9Y",
                sebagai_wali: "Y",
                kabupaten: "Kota Probolinggo",
                updated_at: "2020-08-22T08:18:38.000Z",
                created_at: "2018-08-09T18:47:12.000Z",
                fotodiri: {
                  normal: "/img/default/default_no_face_n.jpg",
                  medium: "/img/default/default_no_face_m.jpg",
                  small: "/img/default/default_no_face_s.jpg",
                },
              },
              {
                id: 7953,
                uuid_person_lawan: "22294e53-753b-4012-9374-921cafe6b674",
                nama_lengkap: "Maryama",
                nokk: "3574022607100002",
                nik: "3574024107100001",
                no_passport: null,
                status_relasi: "Ibu kandung",
                kode_relasi: "12Y",
                sebagai_wali: "T",
                kabupaten: "Kota Probolinggo",
                updated_at: "2018-08-09T18:49:31.000Z",
                created_at: "2018-08-09T18:49:31.000Z",
                fotodiri: {
                  normal: "/img/default/default_no_face_n.jpg",
                  medium: "/img/default/default_no_face_m.jpg",
                  small: "/img/default/default_no_face_s.jpg",
                },
              },
            ],
            santri: [
              {
                id: 4671,
                nis: "1720204717",
                tanggal_mulai: "2017-07-05",
                tanggal_akhir: null,
                updated_at: "2021-12-28T20:26:03.000Z",
                created_at: "2018-08-09T18:41:53.000Z",
              },
              {
                id: 11424,
                nis: "2020411522",
                tanggal_mulai: "2020-08-22",
                tanggal_akhir: "2021-12-29",
                updated_at: "2021-12-28T20:26:00.000Z",
                created_at: "2020-08-22T08:17:19.000Z",
              },
            ],
            perizinan_santri: [
              {
                id: 25767,
                nis_santri: "1720204717",
                bermalam: "Y",
                rombongan: "T",
                alasan_izin: "Berobat atau perlu rujuk ke RS lain",
                sejak_tanggal: "2022-08-24 11:11:32",
                sampai_tanggal: "2022-08-27 17:56:38",
                selama: "3 Hari",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
              {
                id: 14887,
                nis_santri: "2020411522",
                bermalam: "Y",
                rombongan: "T",
                alasan_izin: "Berobat atau perlu rujuk ke RS lain",
                sejak_tanggal: "2021-07-15 15:26:19",
                sampai_tanggal: "2021-07-18 17:00:09",
                selama: "3 Hari",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
              {
                id: 6282,
                nis_santri: "2020411522",
                bermalam: "Y",
                rombongan: "T",
                alasan_izin: "Berobat atau perlu rujuk ke RS lain",
                sejak_tanggal: "2021-01-30 08:30:41",
                sampai_tanggal: "2021-02-01 17:00:04",
                selama: "2 Hari",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
              {
                id: 30705,
                nis_santri: "1720204717",
                bermalam: "T",
                rombongan: "Y",
                alasan_izin: "Mengantar Anak Pulang/Sakit",
                sejak_tanggal: "2023-01-25 08:50:52",
                sampai_tanggal: "2023-01-25 15:59:35",
                selama: "7 Jam",
                status_perizinan: "Kembali tepat waktu",
                id_status_perizinan: 7,
              },
              {
                id: 27880,
                nis_santri: "1720204717",
                bermalam: "T",
                rombongan: "Y",
                alasan_izin: "Menghadiri walimatul ursy",
                sejak_tanggal: "2022-11-14 12:15:00",
                sampai_tanggal: "2022-11-14 17:15:00",
                selama: "5 Jam",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
              {
                id: 27623,
                nis_santri: "1720204717",
                bermalam: "T",
                rombongan: "Y",
                alasan_izin: "Mengantar Anak Pulang/Sakit",
                sejak_tanggal: "2022-11-09 10:15:16",
                sampai_tanggal: "2022-11-09 20:15:21",
                selama: "10 Jam",
                status_perizinan: "Kembali tepat waktu",
                id_status_perizinan: 7,
              },
              {
                id: 24780,
                nis_santri: "1720204717",
                bermalam: "T",
                rombongan: "Y",
                alasan_izin: "Menghadiri walimatul hajj/umroh",
                sejak_tanggal: "2022-08-07 09:45:35",
                sampai_tanggal: "2022-08-07 16:45:40",
                selama: "7 Jam",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
              {
                id: 21635,
                nis_santri: "1720204717",
                bermalam: "T",
                rombongan: "Y",
                alasan_izin: "Pengobatan non medis",
                sejak_tanggal: "2022-01-30 10:00:09",
                sampai_tanggal: "2022-01-30 14:00:15",
                selama: "4 Jam",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
              {
                id: 21301,
                nis_santri: "1720204717",
                bermalam: "T",
                rombongan: "Y",
                alasan_izin: "Menghadiri walimatul ursy",
                sejak_tanggal: "2022-01-20 13:00:18",
                sampai_tanggal: "2022-01-20 18:00:32",
                selama: "5 Jam",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
            ],
            pelanggaran_santri: [
              {
                id: 20716,
                nis_santri: "1720204717",
                jenis: "Telat kembali ke pondok pada perizinan santri",
                status: "Sudah diproses",
                kategori: "R",
                created_at: "2022-08-27T17:02:00.000Z",
                updated_at: "2022-10-03T14:33:51.000Z",
              },
              {
                id: 9744,
                nis_santri: "2020411522",
                jenis: "Telat kembali ke pondok pada perizinan santri",
                status: "Belum diproses",
                kategori: "R",
                created_at: "2021-07-18T17:02:00.000Z",
                updated_at: "2021-07-18T17:02:00.000Z",
              },
            ],
            domisili_santri: [
              {
                id: 4915,
                nis_santri: "1720204717",
                id_kamar: 296,
                kamar: "A.03",
                id_blok: 56,
                blok: "Riyadlul Jinan (A)",
                id_wilayah: 16,
                wilayah: "Wilayah Al-Hasyimiyah (DALTIM)",
                tanggal_mulai: "2017-07-04 22:00:00",
                tanggal_akhir: "2019-07-25 07:16:00",
                updated_at: "2019-08-01T15:53:10.000Z",
                created_at: "2018-08-09T18:51:09.000Z",
              },
              {
                id: 12231,
                nis_santri: "1720204717",
                id_kamar: 297,
                kamar: "A.04",
                id_blok: 56,
                blok: "Riyadlul Jinan (A)",
                id_wilayah: 16,
                wilayah: "Wilayah Al-Hasyimiyah (DALTIM)",
                tanggal_mulai: "2019-07-25 07:16:00",
                tanggal_akhir: "2020-08-22 00:00:00",
                updated_at: "2020-08-22T08:17:15.000Z",
                created_at: "2019-08-01T15:53:42.000Z",
              },
              {
                id: 18937,
                nis_santri: "1720204717",
                id_kamar: 302,
                kamar: "E.03",
                id_blok: 60,
                blok: "Zahroil Batul (E)",
                id_wilayah: 16,
                wilayah: "Wilayah Al-Hasyimiyah (DALTIM)",
                tanggal_mulai: "2020-09-04 20:54:00",
                tanggal_akhir: "2020-09-12 21:47:00",
                updated_at: "2021-12-28T20:26:11.000Z",
                created_at: "2020-09-08T13:58:14.000Z",
              },
              {
                id: 19632,
                nis_santri: "1720204717",
                id_kamar: 443,
                kamar: "Kantor BK",
                id_blok: 68,
                blok: "Perkantoran",
                id_wilayah: 16,
                wilayah: "Wilayah Al-Hasyimiyah (DALTIM)",
                tanggal_mulai: "2020-09-13 21:47:00",
                tanggal_akhir: "2023-03-16 17:59:00",
                updated_at: "2023-03-21T11:08:42.000Z",
                created_at: "2020-09-13T15:15:37.000Z",
              },
              {
                id: 40169,
                nis_santri: "1720204717",
                id_kamar: 335,
                kamar: "H.03",
                id_blok: 63,
                blok: "As-Shofwah (H)",
                id_wilayah: 16,
                wilayah: "Wilayah Al-Hasyimiyah (DALTIM)",
                tanggal_mulai: "2023-03-17 17:59:00",
                tanggal_akhir: null,
                updated_at: "2023-03-21T11:08:58.000Z",
                created_at: "2023-03-21T11:08:58.000Z",
              },
            ],
            wali_asuh: [
              {
                id: 2262,
                tanggal_mulai: "2023-06-01",
                tanggal_akhir: null,
                updated_at: "2023-06-09T09:19:52.000Z",
                created_at: "2023-06-09T09:19:52.000Z",
              },
            ],
            group_kewaliasuhan: {
              sebagai: "Wali Asuh",
              id: 131,
              nama: "Daltim As Shofwah 01",
              alias_wilayah: "daltim",
            },
            pendidikan: [
              {
                id: 4894,
                nomor_induk: "131235130040170382",
                lembaga: "MA-NJ",
                id_lembaga: "31",
                jurusan: "Keagamaan",
                id_jurusan: 13,
                kelas: "XII",
                id_kelas: 22,
                rombel: "2",
                id_rombel: 88,
                tanggal_mulai: "2017-07-05",
                tanggal_akhir: "2020-05-02",
                updated_at: "2020-07-20T06:18:05.000Z",
                created_at: "2018-08-09T18:50:20.000Z",
              },
              {
                id: 13013,
                nomor_induk: "2010300032",
                lembaga: "UNUJA",
                id_lembaga: "41",
                jurusan: "S1 Ahwal Al-Syakhsiyyah (AS)",
                id_jurusan: 41,
                kelas: null,
                id_kelas: null,
                rombel: null,
                id_rombel: null,
                tanggal_mulai: "2020-08-19",
                tanggal_akhir: null,
                updated_at: "2021-10-12T13:01:21.000Z",
                created_at: "2020-08-22T08:17:44.000Z",
              },
            ],
            catatan: {
              kognitif: [
                {
                  id: 81220,
                  created_at: "2020-03-27T03:59:46.000Z",
                  materi: "Furudhul 'Ainiyah",
                  catatan:
                    "Berkat ketekunan ananda dalam belajar agar menjadi faqihah fiddin, alhamdulillah materi FA sudah bisa dikuasai ananda dengan baik.",
                  score: "A",
                  tindak_lanjut:
                    "Terus mengevaluasi pemahaman ananda dalam penguasaan materi FA serta memotivasi agar terus memperdalam ilmu agama terutama bidang FA",
                  pencatat: {
                    uuid: "fc886b13-fb25-45b2-bc1b-e535abea9c9e",
                    nik: "3511106205990002",
                    nama_lengkap: "Thoriqotul Faizah",
                    status_scope: "waliasuh",
                    fotodiri: {
                      normal:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_n.jpg",
                      medium:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_m.jpg",
                      small:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_s.jpg",
                    },
                  },
                },
                {
                  id: 81209,
                  created_at: "2020-03-27T03:57:22.000Z",
                  materi: "Baca Al-Qur'an",
                  catatan:
                    "Alhamdulillah, ananda sudah baik dalam membaca AL-Quran",
                  score: "A",
                  tindak_lanjut:
                    "terus memotivasi ananda agar selalu hubbul quran",
                  pencatat: {
                    uuid: "fc886b13-fb25-45b2-bc1b-e535abea9c9e",
                    nik: "3511106205990002",
                    nama_lengkap: "Thoriqotul Faizah",
                    status_scope: "waliasuh",
                    fotodiri: {
                      normal:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_n.jpg",
                      medium:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_m.jpg",
                      small:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_s.jpg",
                    },
                  },
                },
                {
                  id: 71060,
                  created_at: "2020-02-28T17:49:01.000Z",
                  materi: "Furudhul 'Ainiyah",
                  catatan:
                    "Saudari Salsabila sudah dapat memahami dan mempraktikkan materi-materi FA dengan benar",
                  score: "A",
                  tindak_lanjut: "",
                  pencatat: {
                    uuid: "fc886b13-fb25-45b2-bc1b-e535abea9c9e",
                    nik: "3511106205990002",
                    nama_lengkap: "Thoriqotul Faizah",
                    status_scope: "waliasuh",
                    fotodiri: {
                      normal:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_n.jpg",
                      medium:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_m.jpg",
                      small:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_s.jpg",
                    },
                  },
                },
              ],
              afektif: [
                {
                  id: 81681,
                  created_at: "2020-03-27T03:55:16.000Z",
                  materi: "Kebersihan",
                  catatan:
                    "Ananda sudah mampu menjaga kebersihan lingkungan dengan baik",
                  score: "A",
                  tindak_lanjut:
                    "Diapresiasi dengan baik usahanya dalam menjaga kebersihan lingkungan",
                  pencatat: {
                    uuid: "fc886b13-fb25-45b2-bc1b-e535abea9c9e",
                    nik: "3511106205990002",
                    nama_lengkap: "Thoriqotul Faizah",
                    status_scope: "waliasuh",
                    fotodiri: {
                      normal:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_n.jpg",
                      medium:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_m.jpg",
                      small:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_s.jpg",
                    },
                  },
                },
                {
                  id: 81676,
                  created_at: "2020-03-27T03:54:38.000Z",
                  materi: "Akhlak",
                  catatan:
                    "Alhamdulillah akhlak ananda tetap baik pada siapapun",
                  score: "A",
                  tindak_lanjut:
                    "Terus dimotivasi untuk tetap berakhlakul karimah",
                  pencatat: {
                    uuid: "fc886b13-fb25-45b2-bc1b-e535abea9c9e",
                    nik: "3511106205990002",
                    nama_lengkap: "Thoriqotul Faizah",
                    status_scope: "waliasuh",
                    fotodiri: {
                      normal:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_n.jpg",
                      medium:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_m.jpg",
                      small:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_s.jpg",
                    },
                  },
                },
                {
                  id: 72192,
                  created_at: "2020-02-28T17:47:41.000Z",
                  materi: "Kebersihan",
                  catatan:
                    "Saudari Salsabila dapat menjaga kebersihan diri dan Lingkungannya dengan baik",
                  score: "A",
                  tindak_lanjut: "",
                  pencatat: {
                    uuid: "fc886b13-fb25-45b2-bc1b-e535abea9c9e",
                    nik: "3511106205990002",
                    nama_lengkap: "Thoriqotul Faizah",
                    status_scope: "waliasuh",
                    fotodiri: {
                      normal:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_n.jpg",
                      medium:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_m.jpg",
                      small:
                        "/person/fc886b13-fb25-45b2-bc1b-e535abea9c9e/img/2019/12-10_3511106205990002_1575936433541_s.jpg",
                    },
                  },
                },
              ],
            },
            berkas: [
              {
                id: 5583,
                filename: "09-7_3574024807010001_1536253803873.jpg",
                tahun: "2018",
                filesize: "850841",
                id_kategori_image: 8,
                kategori: "Formulir Pendaftaran",
                description: "",
                updated_at: "2019-03-21T06:14:58.000Z",
                created_at: "2018-09-06T17:10:05.000Z",
                thumbnails_url: {
                  original:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2018/09-7_3574024807010001_1536253803873.jpg",
                  normal:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2018/09-7_3574024807010001_1536253803873_n.jpg",
                  medium:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2018/09-7_3574024807010001_1536253803873_m.jpg",
                  small:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2018/09-7_3574024807010001_1536253803873_s.jpg",
                },
              },
              {
                id: 5587,
                filename: "09-7_3574024807010001_1536253864918.jpg",
                tahun: "2018",
                filesize: "381694",
                id_kategori_image: 3,
                kategori: "Akta Kelahiran",
                description: "",
                updated_at: "2019-03-21T06:14:48.000Z",
                created_at: "2018-09-06T17:11:07.000Z",
                thumbnails_url: {
                  original:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2018/09-7_3574024807010001_1536253864918.jpg",
                  normal:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2018/09-7_3574024807010001_1536253864918_n.jpg",
                  medium:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2018/09-7_3574024807010001_1536253864918_m.jpg",
                  small:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2018/09-7_3574024807010001_1536253864918_s.jpg",
                },
              },
              {
                id: 5588,
                filename: "09-7_3574024807010001_1536253864925.jpg",
                tahun: "2018",
                filesize: "1449878",
                id_kategori_image: 1,
                kategori: "Kartu Keluarga (KK)",
                description: "",
                updated_at: "2019-03-21T06:14:44.000Z",
                created_at: "2018-09-06T17:11:07.000Z",
                thumbnails_url: {
                  original:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2018/09-7_3574024807010001_1536253864925.jpg",
                  normal:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2018/09-7_3574024807010001_1536253864925_n.jpg",
                  medium:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2018/09-7_3574024807010001_1536253864925_m.jpg",
                  small:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2018/09-7_3574024807010001_1536253864925_s.jpg",
                },
              },
              {
                id: 13055,
                filename: "01-30_3574024807010001_1548832786314.jpg",
                tahun: "2019",
                filesize: "58007",
                id_kategori_image: 10,
                kategori: "Foto Diri",
                description: "",
                updated_at: "2020-08-22T08:18:45.000Z",
                created_at: "2019-01-30T07:19:46.000Z",
                thumbnails_url: {
                  original:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2019/01-30_3574024807010001_1548832786314.jpg",
                  normal:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2019/01-30_3574024807010001_1548832786314_n.jpg",
                  medium:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2019/01-30_3574024807010001_1548832786314_m.jpg",
                  small:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2019/01-30_3574024807010001_1548832786314_s.jpg",
                },
              },
              {
                id: 40623,
                filename: "08-22_3574024807010001_1598084321268.jpg",
                tahun: "2020",
                filesize: "381742",
                id_kategori_image: 3,
                kategori: "Akta Kelahiran",
                description: "Akta",
                updated_at: "2020-08-22T08:18:45.000Z",
                created_at: "2020-08-22T08:18:45.000Z",
                thumbnails_url: {
                  original:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321268.jpg",
                  normal:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321268_n.jpg",
                  medium:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321268_m.jpg",
                  small:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321268_s.jpg",
                },
              },
              {
                id: 40624,
                filename: "08-22_3574024807010001_1598084321282.jpg",
                tahun: "2020",
                filesize: "1375125",
                id_kategori_image: 1,
                kategori: "Kartu Keluarga (KK)",
                description: "KK",
                updated_at: "2020-08-22T08:18:45.000Z",
                created_at: "2020-08-22T08:18:45.000Z",
                thumbnails_url: {
                  original:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321282.jpg",
                  normal:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321282_n.jpg",
                  medium:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321282_m.jpg",
                  small:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321282_s.jpg",
                },
              },
              {
                id: 40625,
                filename: "08-22_3574024807010001_1598084321294.jpg",
                tahun: "2020",
                filesize: "220169",
                id_kategori_image: 2,
                kategori: "Kartu Tanda Penduduk (KTP)",
                description: "KTP Ayah",
                updated_at: "2020-08-22T08:18:45.000Z",
                created_at: "2020-08-22T08:18:45.000Z",
                thumbnails_url: {
                  original:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321294.jpg",
                  normal:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321294_n.jpg",
                  medium:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321294_m.jpg",
                  small:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321294_s.jpg",
                },
              },
              {
                id: 40626,
                filename: "08-22_3574024807010001_1598084321304.jpg",
                tahun: "2020",
                filesize: "706835",
                id_kategori_image: 9,
                kategori: "Kartu Indonesia Pintar (KIP)",
                description: "foto",
                updated_at: "2020-09-28T14:25:31.000Z",
                created_at: "2020-08-22T08:18:45.000Z",
                thumbnails_url: {
                  original:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321304.jpg",
                  normal:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321304_n.jpg",
                  medium:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321304_m.jpg",
                  small:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/08-22_3574024807010001_1598084321304_s.jpg",
                },
              },
              {
                id: 48876,
                filename: "09-28_3574024807010001_1601303118249.jpg",
                tahun: "2020",
                filesize: "744627",
                id_kategori_image: 10,
                kategori: "Foto Diri",
                description: "Foto",
                updated_at: "2020-09-28T14:25:31.000Z",
                created_at: "2020-09-28T14:25:21.000Z",
                thumbnails_url: {
                  original:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/09-28_3574024807010001_1601303118249.jpg",
                  normal:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/09-28_3574024807010001_1601303118249_n.jpg",
                  medium:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/09-28_3574024807010001_1601303118249_m.jpg",
                  small:
                    "/person/c147d05e-4de3-446e-bae9-ca1fa37cea1b/img/2020/09-28_3574024807010001_1601303118249_s.jpg",
                },
              },
            ],
          }),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          santri_uuid: "8cca75a2-cd75-4ad1-a622-81e1616cc7a4",
          santri_nama: "Alfi Nurindiana",
          blok_id: 56,
          username: "wilayah",
          password:
            "$2a$12$Y.zBTjlzWKsvc39HFHYbrehC4k61DM3BmFSrpKwwtAE.fHysqm2jq", //wilayah
          role: "wilayah",
          raw: JSON.stringify({
            uuid: "8cca75a2-cd75-4ad1-a622-81e1616cc7a4",
            warganegara: "WNI",
            nokk: "3511111005010326",
            nik: "3511114205020002",
            no_passport: null,
            nama_lengkap: "Alfi Nurindiana",
            tempat_lahir: "Bondowoso",
            jenis_kelamin: "P",
            tanggal_lahir: "2002-05-02",
            umur: 21,
            anak_ke: 2,
            jum_saudara: 3,
            tinggal_bersama: "",
            id_jenjang_pendidikan: null,
            jenjang_pendidikan: null,
            pendidikan_terakhir: "MTs-NJ",
            phone1: "+6282244712466",
            phone2: "",
            email: "",
            id_pekerjaan: null,
            id_penghasilan: null,
            pekerjaan: null,
            penghasilan: null,
            jalan: "Jl.  K.h. Wahid Hasyim I/64 Rt 038 Rw 009 Dabasah",
            kodepos: "68211",
            wafat: "T",
            tanggal_wafat: null,
            updated_at: "2018-08-18T14:44:11.000Z",
            created_at: "2018-08-09T15:33:52.000Z",
            id_kecamatan: 3454,
            id_kabupaten: 238,
            kecamatan: "Bondowoso",
            kabupaten: "Kab. Bondowoso",
            provinsi: "Jawa Timur",
            negara: "Indonesia",
            qrcode_url: "/qrcode/uuid/8cca75a2-cd75-4ad1-a622-81e1616cc7a4.png",
            is_valid_nik: true,
            is_excluded_invalid_nik: false,
            warga_pesantren: {
              niup: "21420604012",
              aktif: "Y",
              qrcode_url: "/qrcode/niup/21420604012.png",
            },
            fotodiri: {
              normal:
                "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/09-28_3511114205020002_1601302959948_n.jpg",
              medium:
                "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/09-28_3511114205020002_1601302959948_m.jpg",
              small:
                "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/09-28_3511114205020002_1601302959948_s.jpg",
            },
            keluarga: [
              {
                id: 7618,
                uuid_person_lawan: "05510546-64f7-46dc-82bc-7d490dd0e763",
                nama_lengkap: "Deni Agus Diyanto",
                nokk: "3511111005010326",
                nik: "3511110708720001",
                no_passport: null,
                status_relasi: "Ayah kandung",
                kode_relasi: "9Y",
                sebagai_wali: "Y",
                kabupaten: "Kab. Bondowoso",
                updated_at: "2020-08-26T04:51:07.000Z",
                created_at: "2018-08-09T15:36:40.000Z",
                fotodiri: {
                  normal: "/img/default/default_no_face_n.jpg",
                  medium: "/img/default/default_no_face_m.jpg",
                  small: "/img/default/default_no_face_s.jpg",
                },
              },
              {
                id: 7624,
                uuid_person_lawan: "8e043ea0-b4f9-4b08-8971-59f5aa5a0e42",
                nama_lengkap: "Chairun Nisa'",
                nokk: "3511111005010326",
                nik: "3511115308790001",
                no_passport: null,
                status_relasi: "Ibu kandung",
                kode_relasi: "12Y",
                sebagai_wali: "T",
                kabupaten: "Kab. Bondowoso",
                updated_at: "2020-08-26T04:52:22.000Z",
                created_at: "2018-08-09T15:38:54.000Z",
                fotodiri: {
                  normal: "/img/default/default_no_face_n.jpg",
                  medium: "/img/default/default_no_face_m.jpg",
                  small: "/img/default/default_no_face_s.jpg",
                },
              },
              {
                id: 33725,
                uuid_person_lawan: "1a6ea012-637f-4586-9c1e-e70ee9fc82b8",
                nama_lengkap: "Majid Rizaldi",
                nokk: "3511111005010326",
                nik: "3511110711960001",
                no_passport: null,
                status_relasi: "Saudara kandung (seibu dan seayah)",
                kode_relasi: "19Y",
                sebagai_wali: "T",
                kabupaten: "Kab. Bondowoso",
                updated_at: "2021-10-27T08:39:04.000Z",
                created_at: "2021-10-27T08:39:04.000Z",
                fotodiri: {
                  normal: "/img/default/default_no_face_n.jpg",
                  medium: "/img/default/default_no_face_m.jpg",
                  small: "/img/default/default_no_face_s.jpg",
                },
              },
            ],
            santri: [
              {
                id: 4497,
                nis: "1420004533",
                tanggal_mulai: "2014-08-06",
                tanggal_akhir: null,
                updated_at: "2018-08-09T15:34:25.000Z",
                created_at: "2018-08-09T15:34:25.000Z",
              },
            ],
            perizinan_santri: [
              {
                id: 32976,
                nis_santri: "1420004533",
                bermalam: "Y",
                rombongan: "T",
                alasan_izin: "Keluarga meninggal",
                sejak_tanggal: "2023-05-23 13:47:16",
                sampai_tanggal: "2023-05-26 17:00:23",
                selama: "3 Hari",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
              {
                id: 31365,
                nis_santri: "1420004533",
                bermalam: "Y",
                rombongan: "T",
                alasan_izin: "Berobat atau perlu rujuk ke RS lain",
                sejak_tanggal: "2023-02-10 11:13:27",
                sampai_tanggal: "2023-02-13 17:00:50",
                selama: "3 Hari",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
              {
                id: 24062,
                nis_santri: "1420004533",
                bermalam: "Y",
                rombongan: "T",
                alasan_izin: "Berobat atau perlu rujuk ke RS lain",
                sejak_tanggal: "2022-07-22 10:23:30",
                sampai_tanggal: "2022-07-24 17:10:35",
                selama: "2 Hari",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
              {
                id: 17968,
                nis_santri: "1420004533",
                bermalam: "Y",
                rombongan: "T",
                alasan_izin: "Berobat atau perlu rujuk ke RS lain",
                sejak_tanggal: "2021-10-27 15:52:46",
                sampai_tanggal: "2021-10-30 17:00:51",
                selama: "3 Hari",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
              {
                id: 31964,
                nis_santri: "1420004533",
                bermalam: "T",
                rombongan: "Y",
                alasan_izin: "Pengobatan non medis",
                sejak_tanggal: "2023-03-01 10:00:10",
                sampai_tanggal: "2023-03-01 13:00:24",
                selama: "3 Jam",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
              {
                id: 21636,
                nis_santri: "1420004533",
                bermalam: "T",
                rombongan: "Y",
                alasan_izin: "Pengobatan non medis",
                sejak_tanggal: "2022-01-30 10:00:16",
                sampai_tanggal: "2022-01-30 13:00:22",
                selama: "3 Jam",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
              {
                id: 4406,
                nis_santri: "1420004533",
                bermalam: "T",
                rombongan: "Y",
                alasan_izin: "Pengobatan non medis",
                sejak_tanggal: "2020-12-30 12:38:19",
                sampai_tanggal: "2020-12-30 14:38:35",
                selama: "2 Jam",
                status_perizinan: "Telat (sudah kembali)",
                id_status_perizinan: 6,
              },
            ],
            pelanggaran_santri: [
              {
                id: 26780,
                nis_santri: "1420004533",
                jenis: "Telat kembali ke pondok pada perizinan santri",
                status: "Sudah diproses",
                kategori: "R",
                created_at: "2023-05-26T17:02:00.000Z",
                updated_at: "2023-06-07T07:23:12.000Z",
              },
              {
                id: 25861,
                nis_santri: "1420004533",
                jenis: "Telat kembali ke pondok pada perizinan santri",
                status: "Sudah diproses",
                kategori: "R",
                created_at: "2023-03-01T17:02:00.000Z",
                updated_at: "2023-04-06T03:29:36.000Z",
              },
              {
                id: 25299,
                nis_santri: "1420004533",
                jenis: "Telat kembali ke pondok pada perizinan santri",
                status: "Sudah diproses",
                kategori: "R",
                created_at: "2023-02-13T17:02:00.000Z",
                updated_at: "2023-02-22T15:22:41.000Z",
              },
              {
                id: 19374,
                nis_santri: "1420004533",
                jenis: "Telat kembali ke pondok pada perizinan santri",
                status: "Sudah diproses",
                kategori: "R",
                created_at: "2022-07-24T17:02:00.000Z",
                updated_at: "2022-08-18T00:56:15.000Z",
              },
              {
                id: 13238,
                nis_santri: "1420004533",
                jenis: "Telat kembali ke pondok pada perizinan santri",
                status: "Sudah diproses",
                kategori: "R",
                created_at: "2021-10-30T17:02:00.000Z",
                updated_at: "2022-03-10T18:19:31.000Z",
              },
            ],
            domisili_santri: [
              {
                id: 4749,
                nis_santri: "1420004533",
                id_kamar: 386,
                kamar: "C.04",
                id_blok: 73,
                blok: "Robi'ah Al-Adawiyah",
                id_wilayah: 17,
                wilayah: "Wilayah Fatimatuz Zahro (DALSEL)",
                tanggal_mulai: "2014-07-04 22:00:00",
                tanggal_akhir: "2017-06-05 05:00:00",
                updated_at: "2018-08-18T14:45:46.000Z",
                created_at: "2018-08-09T15:40:02.000Z",
              },
              {
                id: 6193,
                nis_santri: "1420004533",
                id_kamar: 295,
                kamar: "A.02",
                id_blok: 56,
                blok: "Riyadlul Jinan (A)",
                id_wilayah: 16,
                wilayah: "Wilayah Al-Hasyimiyah (DALTIM)",
                tanggal_mulai: "2017-07-04 22:00:00",
                tanggal_akhir: "2019-07-25 07:16:00",
                updated_at: "2019-08-01T15:27:00.000Z",
                created_at: "2018-08-18T14:46:44.000Z",
              },
              {
                id: 12219,
                nis_santri: "1420004533",
                id_kamar: 296,
                kamar: "A.03",
                id_blok: 56,
                blok: "Riyadlul Jinan (A)",
                id_wilayah: 16,
                wilayah: "Wilayah Al-Hasyimiyah (DALTIM)",
                tanggal_mulai: "2019-07-25 07:16:00",
                tanggal_akhir: "2020-08-26 08:07:00",
                updated_at: "2020-08-26T04:49:33.000Z",
                created_at: "2019-08-01T15:27:22.000Z",
              },
              {
                id: 17850,
                nis_santri: "1420004533",
                id_kamar: 347,
                kamar: "I.06",
                id_blok: 64,
                blok: "Al-Masruriyah (I)",
                id_wilayah: 16,
                wilayah: "Wilayah Al-Hasyimiyah (DALTIM)",
                tanggal_mulai: "2020-08-26 08:07:00",
                tanggal_akhir: "2020-09-11 22:23:00",
                updated_at: "2020-09-11T15:23:35.000Z",
                created_at: "2020-08-26T04:49:53.000Z",
              },
              {
                id: 19286,
                nis_santri: "1420004533",
                id_kamar: 299,
                kamar: "A.06",
                id_blok: 56,
                blok: "Riyadlul Jinan (A)",
                id_wilayah: 16,
                wilayah: "Wilayah Al-Hasyimiyah (DALTIM)",
                tanggal_mulai: "2020-09-11 22:23:00",
                tanggal_akhir: null,
                updated_at: "2020-09-11T15:23:46.000Z",
                created_at: "2020-09-11T15:23:46.000Z",
              },
            ],
            wali_asuh: [
              {
                id: 1268,
                tanggal_mulai: "2020-09-26",
                tanggal_akhir: null,
                updated_at: "2020-09-28T15:01:58.000Z",
                created_at: "2020-09-28T15:01:58.000Z",
              },
            ],
            group_kewaliasuhan: {
              sebagai: "Wali Asuh",
              id: null,
              nama: null,
              alias_wilayah: null,
            },
            pendidikan: [
              {
                id: 4713,
                nomor_induk: null,
                lembaga: "MTs-NJ",
                id_lembaga: "21",
                jurusan: "Bahasa",
                id_jurusan: 4,
                kelas: "VII",
                id_kelas: 11,
                rombel: null,
                id_rombel: null,
                tanggal_mulai: "2014-07-19",
                tanggal_akhir: "2017-06-05",
                updated_at: "2018-08-18T14:44:11.000Z",
                created_at: "2018-08-09T15:39:37.000Z",
              },
              {
                id: 6193,
                nomor_induk: "131235130040170360",
                lembaga: "MA-NJ",
                id_lembaga: "31",
                jurusan: "Keagamaan",
                id_jurusan: 13,
                kelas: "XII",
                id_kelas: 22,
                rombel: "2",
                id_rombel: 88,
                tanggal_mulai: "2017-07-19",
                tanggal_akhir: "2020-05-02",
                updated_at: "2020-07-20T06:18:05.000Z",
                created_at: "2018-08-18T14:44:45.000Z",
              },
              {
                id: 14081,
                nomor_induk: "2042300014",
                lembaga: "UNUJA",
                id_lembaga: "41",
                jurusan: "S1 Pendidikan Bahasa Inggris",
                id_jurusan: 57,
                kelas: null,
                id_kelas: null,
                rombel: null,
                id_rombel: null,
                tanggal_mulai: "2020-08-19",
                tanggal_akhir: null,
                updated_at: "2021-10-12T15:26:19.000Z",
                created_at: "2020-08-26T04:50:11.000Z",
              },
            ],
            catatan: {
              kognitif: [
                {
                  id: 80064,
                  created_at: "2020-03-26T07:33:41.000Z",
                  materi: "Furudhul 'Ainiyah",
                  catatan:
                    "alhamdulillah setelah menjadi muallimat FA di wilayah Al-hasyimiyah ananda semakin mampu mengamalkan ilmu yang telah diperolehnya dengan baik",
                  score: "A",
                  tindak_lanjut:
                    "terus memotivasi ananda untuk senantiasa mengabdi pada pesantren dengan menjadi salah satu pengajar FA",
                  pencatat: {
                    uuid: "c58f6599-98c8-4208-854b-a1751f96d104",
                    nik: "3512045904990002",
                    nama_lengkap: "Nada Fitria",
                    status_scope: "waliasuh",
                    fotodiri: {
                      normal:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_n.jpg",
                      medium:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_m.jpg",
                      small:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_s.jpg",
                    },
                  },
                },
                {
                  id: 80060,
                  created_at: "2020-03-26T07:30:20.000Z",
                  materi: "Baca Al-Qur'an",
                  catatan:
                    "Alhamdulillah setelah beberapa lama menjadi muallimat al-quran metode ummi, ananda semakin bisa mengamalkan alquran dengan baik",
                  score: "A",
                  tindak_lanjut:
                    "terus mengapresiasi dan memotivasi ananda untuk terus rajin menghadiri muallimat sebagai bentuk pengabdian pada pesantren terutama Alquran karim",
                  pencatat: {
                    uuid: "c58f6599-98c8-4208-854b-a1751f96d104",
                    nik: "3512045904990002",
                    nama_lengkap: "Nada Fitria",
                    status_scope: "waliasuh",
                    fotodiri: {
                      normal:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_n.jpg",
                      medium:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_m.jpg",
                      small:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_s.jpg",
                    },
                  },
                },
                {
                  id: 66777,
                  created_at: "2020-02-26T11:46:30.000Z",
                  materi: "Furudhul 'Ainiyah",
                  catatan:
                    "Berkat ketekunan ananda dalam belajar agar menjadi faqihah fiddin, alhamdulillah materi FA sudah bisa dikuasai ananda dengan baik",
                  score: "A",
                  tindak_lanjut:
                    "Terus mengevaluasi pemahaman ananda dalam penguasaan materi FA serta memotivasi agar terus memperdalam ilmu agama terutama bidang FA",
                  pencatat: {
                    uuid: "c58f6599-98c8-4208-854b-a1751f96d104",
                    nik: "3512045904990002",
                    nama_lengkap: "Nada Fitria",
                    status_scope: "waliasuh",
                    fotodiri: {
                      normal:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_n.jpg",
                      medium:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_m.jpg",
                      small:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_s.jpg",
                    },
                  },
                },
              ],
              afektif: [
                {
                  id: 80584,
                  created_at: "2020-03-26T07:28:58.000Z",
                  materi: "Kebersihan",
                  catatan:
                    "Ananda sudah mampu menjaga kebersihan lingkungan dengan baik",
                  score: "A",
                  tindak_lanjut:
                    "Diapresiasi dengan baik usahanya dalam menjaga kebersihan lingkungan",
                  pencatat: {
                    uuid: "c58f6599-98c8-4208-854b-a1751f96d104",
                    nik: "3512045904990002",
                    nama_lengkap: "Nada Fitria",
                    status_scope: "waliasuh",
                    fotodiri: {
                      normal:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_n.jpg",
                      medium:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_m.jpg",
                      small:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_s.jpg",
                    },
                  },
                },
                {
                  id: 80582,
                  created_at: "2020-03-26T07:28:15.000Z",
                  materi: "Akhlak",
                  catatan:
                    "Alhamdulillah setelah beberapa lama menjadi muallimat al-quran metode ummi, ananda semakin bisa mengamalkan alquran dengan baik",
                  score: "A",
                  tindak_lanjut:
                    "terus mengapresiasi dan memotivasi ananda untuk terus rajin menghadiri muallimat sebagai bentuk pengabdian pada pesantren terutama Alquran karim",
                  pencatat: {
                    uuid: "c58f6599-98c8-4208-854b-a1751f96d104",
                    nik: "3512045904990002",
                    nama_lengkap: "Nada Fitria",
                    status_scope: "waliasuh",
                    fotodiri: {
                      normal:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_n.jpg",
                      medium:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_m.jpg",
                      small:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_s.jpg",
                    },
                  },
                },
                {
                  id: 67441,
                  created_at: "2020-02-26T11:44:48.000Z",
                  materi: "Kebersihan",
                  catatan:
                    "ananda sudah sangat bisa menjaga lingkungan dengan baik",
                  score: "A",
                  tindak_lanjut: "selalu diapresiasi",
                  pencatat: {
                    uuid: "c58f6599-98c8-4208-854b-a1751f96d104",
                    nik: "3512045904990002",
                    nama_lengkap: "Nada Fitria",
                    status_scope: "waliasuh",
                    fotodiri: {
                      normal:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_n.jpg",
                      medium:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_m.jpg",
                      small:
                        "/person/c58f6599-98c8-4208-854b-a1751f96d104/img/2019/12-10_3512045904990002_1575936365292_s.jpg",
                    },
                  },
                },
              ],
            },
            berkas: [
              {
                id: 5804,
                filename: "09-7_3511114205020002_1536255650924.jpg",
                tahun: "2018",
                filesize: "1051048",
                id_kategori_image: 1,
                kategori: "Kartu Keluarga (KK)",
                description: "",
                updated_at: "2019-03-21T06:11:57.000Z",
                created_at: "2018-09-06T17:40:53.000Z",
                thumbnails_url: {
                  original:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2018/09-7_3511114205020002_1536255650924.jpg",
                  normal:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2018/09-7_3511114205020002_1536255650924_n.jpg",
                  medium:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2018/09-7_3511114205020002_1536255650924_m.jpg",
                  small:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2018/09-7_3511114205020002_1536255650924_s.jpg",
                },
              },
              {
                id: 5805,
                filename: "09-7_3511114205020002_1536255650935.jpg",
                tahun: "2018",
                filesize: "867541",
                id_kategori_image: 8,
                kategori: "Formulir Pendaftaran",
                description: "",
                updated_at: "2019-03-21T06:11:38.000Z",
                created_at: "2018-09-06T17:40:53.000Z",
                thumbnails_url: {
                  original:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2018/09-7_3511114205020002_1536255650935.jpg",
                  normal:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2018/09-7_3511114205020002_1536255650935_n.jpg",
                  medium:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2018/09-7_3511114205020002_1536255650935_m.jpg",
                  small:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2018/09-7_3511114205020002_1536255650935_s.jpg",
                },
              },
              {
                id: 5806,
                filename: "09-7_3511114205020002_1536255650947.jpg",
                tahun: "2018",
                filesize: "646465",
                id_kategori_image: 3,
                kategori: "Akta Kelahiran",
                description: "",
                updated_at: "2019-03-21T06:11:31.000Z",
                created_at: "2018-09-06T17:40:53.000Z",
                thumbnails_url: {
                  original:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2018/09-7_3511114205020002_1536255650947.jpg",
                  normal:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2018/09-7_3511114205020002_1536255650947_n.jpg",
                  medium:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2018/09-7_3511114205020002_1536255650947_m.jpg",
                  small:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2018/09-7_3511114205020002_1536255650947_s.jpg",
                },
              },
              {
                id: 47562,
                filename: "08-26_3511114205020002_1598417546664.jpg",
                tahun: "2020",
                filesize: "676042",
                id_kategori_image: 10,
                kategori: "Foto Diri",
                description: "foto",
                updated_at: "2020-09-28T14:23:02.000Z",
                created_at: "2020-08-26T04:52:30.000Z",
                thumbnails_url: {
                  original:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546664.jpg",
                  normal:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546664_n.jpg",
                  medium:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546664_m.jpg",
                  small:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546664_s.jpg",
                },
              },
              {
                id: 47563,
                filename: "08-26_3511114205020002_1598417546679.jpg",
                tahun: "2020",
                filesize: "979260",
                id_kategori_image: 3,
                kategori: "Akta Kelahiran",
                description: "Akta",
                updated_at: "2020-08-26T04:52:30.000Z",
                created_at: "2020-08-26T04:52:30.000Z",
                thumbnails_url: {
                  original:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546679.jpg",
                  normal:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546679_n.jpg",
                  medium:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546679_m.jpg",
                  small:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546679_s.jpg",
                },
              },
              {
                id: 47564,
                filename: "08-26_3511114205020002_1598417546695.jpg",
                tahun: "2020",
                filesize: "1775290",
                id_kategori_image: 1,
                kategori: "Kartu Keluarga (KK)",
                description: "KK",
                updated_at: "2020-08-26T04:52:30.000Z",
                created_at: "2020-08-26T04:52:30.000Z",
                thumbnails_url: {
                  original:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546695.jpg",
                  normal:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546695_n.jpg",
                  medium:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546695_m.jpg",
                  small:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546695_s.jpg",
                },
              },
              {
                id: 47565,
                filename: "08-26_3511114205020002_1598417546708.jpg",
                tahun: "2020",
                filesize: "199194",
                id_kategori_image: 2,
                kategori: "Kartu Tanda Penduduk (KTP)",
                description: "KTP Ayah",
                updated_at: "2020-08-26T04:52:30.000Z",
                created_at: "2020-08-26T04:52:30.000Z",
                thumbnails_url: {
                  original:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546708.jpg",
                  normal:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546708_n.jpg",
                  medium:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546708_m.jpg",
                  small:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546708_s.jpg",
                },
              },
              {
                id: 47566,
                filename: "08-26_3511114205020002_1598417546716.jpg",
                tahun: "2020",
                filesize: "267285",
                id_kategori_image: 2,
                kategori: "Kartu Tanda Penduduk (KTP)",
                description: "KTP Ibu",
                updated_at: "2020-08-26T04:52:30.000Z",
                created_at: "2020-08-26T04:52:30.000Z",
                thumbnails_url: {
                  original:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546716.jpg",
                  normal:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546716_n.jpg",
                  medium:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546716_m.jpg",
                  small:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/08-26_3511114205020002_1598417546716_s.jpg",
                },
              },
              {
                id: 48874,
                filename: "09-28_3511114205020002_1601302959948.jpg",
                tahun: "2020",
                filesize: "676758",
                id_kategori_image: 10,
                kategori: "Foto Diri",
                description: "Foto",
                updated_at: "2020-09-28T14:23:02.000Z",
                created_at: "2020-09-28T14:22:43.000Z",
                thumbnails_url: {
                  original:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/09-28_3511114205020002_1601302959948.jpg",
                  normal:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/09-28_3511114205020002_1601302959948_n.jpg",
                  medium:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/09-28_3511114205020002_1601302959948_m.jpg",
                  small:
                    "/person/8cca75a2-cd75-4ad1-a622-81e1616cc7a4/img/2020/09-28_3511114205020002_1601302959948_s.jpg",
                },
              },
            ],
            kunjungan_mahrom: {
              dikunjungi_oleh: [
                {
                  uuid_person: "05510546-64f7-46dc-82bc-7d490dd0e763",
                  nama_lengkap: "Deni Agus Diyanto",
                  jenis_kelamin: "L",
                  status_relasi: "Ayah kandung",
                  tanggal: "2019-10-18 12:32:17",
                },
              ],
            },
          }),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", null, {});
  },
};
