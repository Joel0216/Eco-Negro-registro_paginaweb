// Productos disponibles
const productos = [
    {
        id: 'coins_100',
        nombre: '100 Monedas',
        descripcion: 'Pack básico de monedas',
        precio: 0.99,
        monedas: 100,
        icono: '💰',
        popular: false
    },
    {
        id: 'coins_500',
        nombre: '500 Monedas',
        descripcion: 'Pack popular - ¡20% extra!',
        precio: 3.99,
        monedas: 600,
        icono: '💰',
        popular: true
    },
    {
        id: 'coins_1000',
        nombre: '1000 Monedas',
        descripcion: 'Pack premium - ¡30% extra!',
        precio: 6.99,
        monedas: 1300,
        icono: '💰',
        popular: false
    },
    {
        id: 'coins_2500',
        nombre: '2500 Monedas',
        descripcion: 'Pack especial - ¡40% extra!',
        precio: 14.99,
        monedas: 3500,
        icono: '💎',
        popular: false
    },
    {
        id: 'coins_5000',
        nombre: '5000 Monedas',
        descripcion: 'Mega pack - ¡50% extra!',
        precio: 29.99,
        monedas: 7500,
        icono: '💎',
        popular: false
    },
    {
        id: 'coins_10000',
        nombre: '10000 Monedas',
        descripcion: 'Pack definitivo - ¡60% extra!',
        precio: 49.99,
        monedas: 16000,
        icono: '👑',
        popular: false
    }
];

// Objetos disponibles en la tienda
const objetos = [
    {
        id: 'chip_hiper_eco',
        nombre: 'Chip de Hiper-Eco',
        descripcion: 'Mejora tu eficiencia energética',
        precio: 500,
        imagen: 'objetos/Chip de Hiper-Eco.jpeg',
        video: 'objetos/Chip de Hiper-Eco.mp4'
    },
    {
        id: 'inhibidor_sonico',
        nombre: 'Inhibidor Sónico',
        descripcion: 'Controla las ondas sonoras',
        precio: 750,
        imagen: 'objetos/Inhibidor Sónico.png',
        video: 'objetos/Inhibidor Sónico.mp4'
    },
    {
        id: 'bateria_resonante',
        nombre: 'Batería Resonante',
        descripcion: 'Energía ilimitada para tus dispositivos',
        precio: 1000,
        imagen: 'objetos/Batería Resonante.png',
        video: 'objetos/Batería Resonante.mp4'
    }
];
