//higher-order component HOC - Function

const t = 'halo'

const function_1 = (param) => {
    console.log('1->' + param + t)
}

const function_2 = (param) => {
    console.log('2->' + param + t)
}

const function_hoc = (callback) => {
    const t_c = 'abc'
    callback('123'+t_c)
}

const function_hoc2 = (callback) => (x) => {
    const t_c2 = 'def'
    callback(x+t_c2)
}

function_1('123')
function_2('abc')
function_hoc(function_1)
function_hoc2(function_1)('func')
function_hoc2(function_2)('func2')

//--------

const Component = (props) => {
    return console.log('JSX' + props)
}

//--------
// const hoc = (Component) => (param) => {
//     return Component(t + param)
// }

const hoc = (Component) => (param) => {
    const t = 'abc'
    return <Component {...props} t={t} />
}

//--function(param)
{/* <Component props='123'/> */}