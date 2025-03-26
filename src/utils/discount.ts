
export const fixAmountDiscount = (price: number, amount: number): number => {
  if (price <= 0) {
    return 0
  }
  return  amount
}

export const percentageDiscount = (price: number, percent: number): number => {
  if (price <= 0) {
    return 0
  }
  return price * percent/100
}

export const percentageDiscountByItemCategory = (product: any, price: number, category: string, amountPercent: number): number => {
  const findProductBtCategory = product.filter((list: any) => list.category === category)
  if (findProductBtCategory.length === 0) {
    return 0
  }
  if (price <= 0) {
    return 0
  }
  const calDiscount = findProductBtCategory.map((list: any) => {
    const totalPrice = list.price * list.quantity
    return totalPrice - (totalPrice * amountPercent/100)
  });
  const totalDiscount = calDiscount.reduce((sum: number, discount: number) => sum + discount, 0);
  return totalDiscount
}

export const pointDiscount = (price: number, point: number): number => {
  if (price <= 0) {
    return 0
  }
  const checkPoint = price * 0.2 // 20% is max value discount for use point
  if (point > checkPoint ) {
    return checkPoint
  }
  return point
}

export const specialDiscount = (price: number, everyPrice: number, amount: number): number => {
  if (price <= 0) {
    return 0
  }
  if (everyPrice > price) {
    // 'everyPrice can not more than price!!'
    return 0 
  }
  if (everyPrice <= 0) {
    //  'everyPrice can not less than 0!!'
     return 0 
  }
  const time = Math.floor(price / everyPrice)
  return (time * amount)
}