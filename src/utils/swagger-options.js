export const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion de Cart y Products',
            description: 'Documentacion para endpoints de productos y carritos'
        }
    },
    apis: ['./src/docs/**/*.yaml']
}