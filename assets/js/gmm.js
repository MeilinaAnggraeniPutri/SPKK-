// Memperoleh Matriks Keputusan dengan GMM
exports.getMatriksKeputusan = async function(penilaian, pegawaiId) {
    try {
        var matriksKeputusan = [];
        for (var i = 0; i < pegawaiId.length; i++) {
            var userValue = [];
            const penilaianData = await penilaian.find({pegawaiID: pegawaiId[i]}, {_id: 0, 'criterias.subCriteria': 1});
            for (var j = 0; j < penilaianData.length; j++) {
                var rowDataUser = [];
                const criterias = penilaianData[j].criterias;
                for (var k = 0; k < criterias.length; k++) {
                    const dataCriteria = criterias[k].subCriteria

                    // Menjumlahkan SubCriteria menjadi value setiap Criteria
                    const total = dataCriteria.map(Number).reduce((acc, val) => acc + val, 0);
                    rowDataUser.push(total);
                }
                userValue.push(rowDataUser);
            }

            // Tranpose Matriks untuk melakukan geoMean tiap critera
            var tranpose = userValue.reduce((acc, val) => {
                val.forEach((num, index) => {
                    acc[index] = acc[index] || [];
                    acc[index].push(num);
                });
                return acc;
            }, []);

            var userGeoMean = [];
            
            // Melakukan Operasi GeoMean
            for (var l = 0; l < tranpose.length; l++) {
                const criteriaValue = tranpose[l].reduce((acc, val) => acc * val, 1);
                const geoMean = Math.pow(criteriaValue, 1 / tranpose[l].length);
                userGeoMean.push(geoMean);
            }

            matriksKeputusan.push(userGeoMean);
        }

        return matriksKeputusan;
    } catch (e) {
        console.log(e);
    }
}