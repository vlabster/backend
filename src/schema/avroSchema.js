const avro = require("avro-js");

const Merchandise = avro.parse({
    // фотография товара (лицевая часть). По возможности, и содержимое, если это таблетка
    preview: "string",

    // Инструкция к лекарственных упрепарату / описание изделия медицинского применения
    instruction: "string",

    // Цена
    price: "string",

    //Вариации формы выпуска
    variables: "string",

    //Дополнительные препараты
    additionalProducts: "string",
});
