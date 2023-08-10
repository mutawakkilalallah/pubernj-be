SELECT
    ds.nama AS nama_dropspot,
    COALESCE(total_putra, 0) AS total_putra,
    COALESCE(total_putri, 0) AS total_putri,
    COALESCE(total_putra_putri, 0) AS total_putra_putri,
    COALESCE(bayar_putra, 0) AS bayar_putra,
    COALESCE(bayar_putri, 0) AS bayar_putri,
    COALESCE(bayar_putra_putri, 0) AS bayar_putra_putri,
    COALESCE(pendapatan_putra, 0) AS pendapatan_putra,
    COALESCE(pendapatan_putri, 0) AS pendapatan_putri,
    COALESCE(pendapatan_putra_putri, 0) AS pendapatan_putra_putri,
    COALESCE(ongkos_putra_putri, 0) AS ongkos_putra_putri,
    COALESCE(ongkos_putra, 0) AS ongkos_putra,
    COALESCE(ongkos_putri, 0) AS ongkos_putri,
    COALESCE(pendapatan_putra_putri - ongkos_putra_putri, 0) AS laba_putra_putri,
    COALESCE(pendapatan_putra - ongkos_putra, 0) AS laba_putra,
    COALESCE(pendapatan_putri - ongkos_putri, 0) AS laba_putri,
    COALESCE(bayar_putra_putri - ongkos_putra_putri, 0) AS pra_laba_putra_putri,
    COALESCE(bayar_putra - ongkos_putra, 0) AS pra_laba_putra,
    COALESCE(bayar_putri - ongkos_putri, 0) AS pra_laba_putri
FROM
    dropspot ds
LEFT JOIN (
    SELECT
        d.id AS dropspot_id,
        SUM(CASE WHEN s.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS total_putra,
        SUM(CASE WHEN s.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS total_putri,
        COUNT(*) AS total_putra_putri
    FROM
        penumpang p
    JOIN
        santri s ON p.santri_uuid = s.uuid
    JOIN
        dropspot d ON p.dropspot_id = d.id
    GROUP BY
        d.id
) total ON ds.id = total.dropspot_id
LEFT JOIN (
    SELECT
        d.id AS dropspot_id,
        SUM(CASE WHEN s.jenis_kelamin = 'L' THEN p.jumlah_bayar ELSE 0 END) AS bayar_putra,
        SUM(CASE WHEN s.jenis_kelamin = 'P' THEN p.jumlah_bayar ELSE 0 END) AS bayar_putri,
        SUM(p.jumlah_bayar) AS bayar_putra_putri
    FROM
        penumpang p
    JOIN
        santri s ON p.santri_uuid = s.uuid
    JOIN
        dropspot d ON p.dropspot_id = d.id
    GROUP BY
        d.id
) estimasi_bayar ON ds.id = estimasi_bayar.dropspot_id
LEFT JOIN (
    SELECT
        d.id AS dropspot_id,
        SUM(CASE WHEN s.jenis_kelamin = 'L' THEN d.harga ELSE 0 END) AS pendapatan_putra,
        SUM(CASE WHEN s.jenis_kelamin = 'P' THEN d.harga ELSE 0 END) AS pendapatan_putri,
        SUM(d.harga) AS pendapatan_putra_putri
    FROM
        penumpang p
    JOIN
        santri s ON p.santri_uuid = s.uuid
    JOIN
        dropspot d ON p.dropspot_id = d.id
    GROUP BY
        d.id
) pendapatan ON ds.id = pendapatan.dropspot_id
LEFT JOIN (
    SELECT
        d.id AS dropspot_id,
        COALESCE(SUM(CASE WHEN a.jenis = 'putra' OR a.jenis = 'putri' THEN a.harga ELSE 0 END), 0) AS ongkos_putra_putri,
        COALESCE(SUM(CASE WHEN a.jenis = 'putra' THEN a.harga ELSE 0 END), 0) AS ongkos_putra,
        COALESCE(SUM(CASE WHEN a.jenis = 'putri' THEN a.harga ELSE 0 END), 0) AS ongkos_putri
    FROM
        armada a
    JOIN
        dropspot d ON a.dropspot_id = d.id
    GROUP BY
        d.id
) ongkos ON ds.id = ongkos.dropspot_id;