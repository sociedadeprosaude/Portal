export default (value) => {
    //return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' })
}
