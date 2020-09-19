let M =
{
    v : 'v',
    f : function()
    {
        console.log(this.v);
    }
}

module.exports = M; //다른 파일에서 사용 할 수 있는 객체를 만듬