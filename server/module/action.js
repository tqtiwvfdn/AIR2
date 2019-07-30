


module.exports=(router)=>{
    router.post('/ConfigMgrAction_retrieveConfig.do',(ctx,next)=>{
        ctx.response.type = 'json';
        ctx.response.body=JSON.stringify([]);
    });

    router.post('/ConfigMgrAction_createConfig.do',(ctx)=>{
        ctx.response.type = 'json';
        ctx.response.body=JSON.stringify({
            status:true
        });
        ctx.request.body.config;
        ctx.request.body.name;
    });

    
    router.post('/ConfigMgrAction_deleteConfig.do',(ctx)=>{
        ctx.response.type = 'json';
        ctx.response.body=JSON.stringify({
            status:true
        });
    });
    
}