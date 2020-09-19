let o = 
{
    v1 : 'v1',
    v2 : 'v2',
    f1 : () =>
    {
        console.log(o.v1);
    },
    f2 : () =>
    {
        console.log(o.v2);
    }
}

f1();
f2();