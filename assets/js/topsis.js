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

        return matriksTernormalisasi ;

    } catch (e) {
        console.log(e);
    }
}

// Pebobotan Matriks Ternormalisasi
exports.pembobotanMatriks = async function(matriksTernormalisasi, bobot) {
    try {
        var matriksTerbobot = [];

        // Perhirungan Matriks Normalisasi Terbobot
        for (var i = 0; i < matriksTernormalisasi.length; i++) {
            var rowMatriks = [];

            for (var j = 0; j < matriksTernormalisasi[i].length; j++) {
                var nilaiTerbobot = matriksTernormalisasi[i][j] * bobot[j];
                rowMatriks.push(nilaiTerbobot);
            }
            matriksTerbobot.push(rowMatriks);
        }
        return matriksTerbobot;
    } catch (e) {
        console.log(e);
    }
}

// Function untuk memperoleh solusi ideal
exports.getSolusiIdeal = async function(matriksTerbobot, tipeCriteria, tipeSolusi)  {
    try {
        // tipeCriteria => 0: cost, 1: benefit
        // tipeSolusi => 0: negatif, 1: positif
        
        // Tranpose Matriks untuk operasi nilai setiap kriteria
        var tranpose = matriksTerbobot.reduce((acc, val) => {
            val.forEach((num, index) => {
                acc[index] = acc[index] || [];
                acc[index].push(num);
            });
            return acc;
        }, []);

        var solusiIdeal = [];

        for (var i = 0; i < tranpose.length; i++) {
            var solusi = 0;

            if (tipeSolusi == 1) {
                if (tipeCriteria[i] == 1) {
                    // Positif Benefit
                    solusi = Math.max(...tranpose[i]);
                } else {
                    // Positif Cost
                    solusi = Math.min(...tranpose[i]);
                }
            } else {
                if (tipeCriteria[i] == 1) {
                    // Negatif Benefit
                    solusi = Math.min(...tranpose[i]);
                } else {
                    // Negatif Cost
                    solusi = Math.max(...tranpose[i]);
                }
            }
            solusiIdeal.push(solusi);
        }

        return solusiIdeal;
    } catch (e) {
        console.log(e);
    }
}

// Function untuk memperoleh jarak ideal
exports.getJarakIdeal = async function (matriksTerbobot, solusiIdeal) {
    try {
        var jarakIdeal = [];

        for (var i = 0; i < matriksTerbobot.length; i++) {
            var hasil = 0;
            for (var j = 0; j < solusiIdeal.length; j++) {
                var squaredSum = (solusiIdeal[j] - matriksTerbobot[i][j]) ** 2;
                hasil += squaredSum;
            }
            var hasilSqrt = Math.sqrt(hasil);

            jarakIdeal.push(hasilSqrt);
        }

        return jarakIdeal;
    } catch (e) {
        console.log(e);
    }
}

// Function untuk memperoleh nilai preferensi tiap alternatif
exports.getNilaiPreferensi = async function(jarakIdealPositif, jarakIdealNegatif) {
    try {
        var listNilaiPreferensi = [];

        for (var i = 0; i < jarakIdealPositif.length; i++) {
            var hasil = jarakIdealNegatif[i] / (jarakIdealNegatif[i] + jarakIdealPositif[i]);
            listNilaiPreferensi.push(hasil);
        }
        
        return listNilaiPreferensi;
    } catch (e) {
        console.log(e);
    }
}
