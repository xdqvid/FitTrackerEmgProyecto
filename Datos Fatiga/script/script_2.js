// Función para leer el archivo CSV y obtener los datos en formato numérico
function readCSV(file) {
    return fetch(file)
        .then(response => response.text())
        .then(data => {
            // Dividir el archivo CSV en líneas
            const lines = data.split('\n');
            // Convertir las líneas en datos numéricos, ignorando líneas vacías o no numéricas
            const numericData = lines.map(line => parseFloat(line)).filter(value => !isNaN(value));
            return numericData;
        })
        .catch(error => {
            console.error('Error al cargar el archivo:', error);
            return [];
        });
}

// Calcular el promedio de los datos
function calculateAverage(data) {
    const sum = data.reduce((acc, value) => acc + value, 0);
    return sum / data.length;
}

// Leer los datos del archivo CSV emg_data.csv
const emgDataPromise = readCSV('emg_data.csv');

// Leer los datos del archivo CSV emg_data_2.csv
const emgData2Promise = readCSV('emg_data_2.csv');

// Procesar ambos archivos CSV y comparar los promedios
Promise.all([emgDataPromise, emgData2Promise])
    .then(([emgData, emgData2]) => {
        // Verificar si hay datos en el archivo emg_data.csv
        if (emgData.length === 0) {
            console.error('No se encontraron datos en emg_data.csv');
            return;
        }

        // Calcular el promedio de los datos EMG del archivo emg_data.csv
        const average = calculateAverage(emgData);

        // Calcular el promedio del archivo emg_data_2.csv
        const average2 = calculateAverage(emgData2);

        // Mostrar el promedio del archivo emg_data.csv en el HTML
        const averageElement = document.getElementById('average');
        averageElement.textContent = `Average (File 1): ${average.toFixed(2)}`;

        // Mostrar el promedio del archivo emg_data_2.csv en el HTML
        const averageElement2 = document.getElementById('average2');
        averageElement2.textContent = `Average (File 2): ${average2.toFixed(2)}`;

        // Mostrar el mensaje de fatiga dependiendo de la comparación de promedios
        const fatigueMessageElement = document.getElementById('fatigue-message');
        if (average > average2) {
            fatigueMessageElement.textContent = 'No presenta fatiga muscular';
        } else {
            fatigueMessageElement.textContent = 'Presenta fatiga muscular';
        }

        // Crear el gráfico del archivo emg_data_2.csv
        const emgDataChartElement = document.getElementById('emg-data-chart');
        new Chart(emgDataChartElement, {
            type: 'line',
            data: {
                labels: emgData2.map((value, index) => index + 1),
                datasets: [{
                    label: 'EMG Data (File 2)',
                    data: emgData2,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    fill: true,
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                    },
                    y: {
                        beginAtZero: true,
                    }
                }
            }
        });
    });
