// Operasi Topsis untuk Perangkingan

// Normalisasi Matriks Keputusan
exports.normalisasiMatriks = async function(matriksKeputusan) {
    try {
        // Tranpose Matriks untuk menjumlahkan nilai setiap kriteria
        var tranpose = matriksKeputusan.reduce((acc, val) => {
            val.forEach((num, index) => {
                acc[index] = acc[index] || [];
                acc[index].push(num);
            });
            return acc;
        }, []);

        var listHasil = [];

        // Menjumlahkan nilai untuk akar setiap dari kuadrat Criteria
        for (var i = 0; i < tranpose.length; i++) {
            const squaredSum = tranpose[i].reduce((acc, val) => acc + val ** 2, 0);
            const hasil = Math.sqrt(squaredSum);
            listHasil.push(hasil);
        }

        var matriksTernormalisasi = [];

        // Normalisasi nilai setiap kriteria
        for (var j = 0; j < matriksKeputusan.length; j++) {
            var rowMatriks = [];

            for (var k = 0; k < matriksKeputusan[j].length; k++) {
                var nilaiTernormalisasi = matriksKeputusan[j][k] / listHasil[k];
                rowMatriks.push(nilaiTernormalisasi);
            }
            matriksTernormalisasi.push(rowMatriks);
        }

        console.log(matriksTernormalisasi);

    } catch (e) {
        console.log(e);
    }
}