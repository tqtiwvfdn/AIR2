module.exports = (router) => {
    router.get('/GetToolsData_lineData.do', (ctx, next) => {
        ctx.response.type = 'json';
        ctx.response.body = JSON.stringify({
            dataset: '0'
                .repeat(15)
                .split('')
                .map(() => Math.floor(Math.random() * 200))
        })
    });

    router.get('/GetToolsData_pieData.do', (ctx, next) => {
        ctx.response.type = 'json';
        ctx.response.body = JSON.stringify({
            dataset:
                '1'
                    .repeat(5)
                    .split('')
                    .map((e, i) => {
                        return {
                            value: Math.floor(Math.random() * 200),
                            name: `第${i + 1}个`
                        }
                    })
        })
    });

    router.get('/GetToolsData_barData.do', (ctx, next) => {
        ctx.response.type = 'json';
        ctx.response.body = JSON.stringify({
            dataset: '0'
                .repeat(15)
                .split('')
                .map(() => Math.floor(Math.random() * 200))
        })
    });

    router.get('/GetToolsData_scatterplotData.do', (ctx, next) => {
        ctx.response.type = 'json';
        ctx.response.body = JSON.stringify({
            dataset:
                '0'
                    .repeat(300)
                    .split('')
                    .map(() => [
                        Math.floor((Math.random() * 200 + 1500) / 10),
                        Math.floor((Math.random() * 200 + 430) / 10)
                    ])
        })
    });
}