import numeral from 'numeral'

export default function numeralFormat(v: { toString: () => string | string[]; }) {
  return v && numeral(v).format(v.toString().includes('.') ? '0,0.00' : '0,0')
}
