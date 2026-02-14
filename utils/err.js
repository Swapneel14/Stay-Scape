class err extends Error{
    constructor(status,message){
        super();
        console.log(message);
        this.status=status;
        this.message=message
    }
}
module.exports= err;