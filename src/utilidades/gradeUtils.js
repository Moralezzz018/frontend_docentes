export const calcularPromedio = (notas) => {
  if (!notas || notas.length === 0) return 0
  const suma = notas.reduce((acc, nota) => acc + nota, 0)
  return (suma / notas.length).toFixed(2)
}

export const calcularPromedioPonderado = (evaluaciones) => {
  if (!evaluaciones || evaluaciones.length === 0) return 0
  
  const sumaNotas = evaluaciones.reduce((acc, ev) => {
    return acc + (ev.nota * ev.peso)
  }, 0)
  
  const sumaPesos = evaluaciones.reduce((acc, ev) => acc + ev.peso, 0)
  
  return sumaPesos > 0 ? (sumaNotas / sumaPesos).toFixed(2) : 0
}

export const validarNota = (nota, notaMaxima = 100) => {
  const notaNum = parseFloat(nota)
  return !isNaN(notaNum) && notaNum >= 0 && notaNum <= notaMaxima
}
