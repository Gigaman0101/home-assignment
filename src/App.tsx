import { useState } from 'react';
import './App.css'
import {
  fixAmountDiscount,
  percentageDiscount,
  percentageDiscountByItemCategory,
  pointDiscount,
  specialDiscount
} from './utils/discount'

interface Product {
  id: number;
  name: string;
  quantity: number,
  price: number;
  description?: string;
  category: string;
  // images: string[];
}

interface IApplyDiscount {
  type: string,
  campaign: string,
  amount: number,
  specialAmount?: number,
  category?: string
}

const initialCart: Product[] = [
  { id: 1, name: "Laptop", price: 89000, quantity: 1, category: 'Electronic' },
  { id: 2, name: "Mouse", price: 500, quantity: 2, category: 'Electronic' },
  { id: 2, name: "Hamberger", price: 179, quantity: 2, category: 'Food' },
  { id: 2, name: "Hood", price: 199, quantity: 2, category: 'Clothing' },
  { id: 2, name: "Airpod", price: 23000, quantity: 2, category: 'Accessories' },
];

const calculateDiscount = (total: number, discountApply: IApplyDiscount[], initialCart: Product[]) => {


  const calDiscount = discountApply.map(discount => {
    let discountAmount = 0
    switch (discount.campaign) {
      case 'Fixed':
        discountAmount = fixAmountDiscount(total, discount.amount)
        break
      case 'Percentage':
        discountAmount = percentageDiscount(total, discount.amount)
        break
      case 'PercentageByCategory':
        discountAmount = percentageDiscountByItemCategory(initialCart, total, discount.category || '', discount.amount)
        break
      case 'Point':
        discountAmount = pointDiscount(total, discount.amount)
        break
      case 'Special':
        discountAmount = specialDiscount(total, discount.specialAmount || 0, discount.amount)
        break
      default:
        discountAmount = 0
    }
    return {
      type: discount.type,
      discountValue: discountAmount
    }
  })
  
  const totalDis = calDiscount.reduce((sum, list) =>  sum + list.discountValue, 0)

  return {listDiscount: calDiscount, totalDiscount: totalDis};
};

const CartItem = ({ item }) => (
  <div key={item.id} className="mb-2 p-4 flex justify-between">
    <div>
      {item.name} x{item.quantity} - {Number(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
    </div>
  </div>
);

export default function App() {

  const [selectCategory, setSelectCategory] = useState('')
  const [selectCampaign, setSelectCampaign] = useState('')
  const [selectCondition, setSelectCondition] = useState<number>(0)
  const [conditionAdd, setConditionAdd] = useState<number>(0)
  const [conditionCate, setConditionCate] = useState('')

  const [discountApply, setDisCountApply] = useState<IApplyDiscount[]>([]);

  const total = initialCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectCondition <= 0) {
      alert(`กรุณาใส่ จำนวนให้มากกว่า 0`);
      return
    }
    if (selectCampaign === 'PercentageByCategory' && !conditionCate || selectCampaign === 'Special' && !conditionAdd) {
      alert(`กรุณาใส่ เงื่อนไขให้ครบ`);
      return
    }

    const applyDis: IApplyDiscount = {
      amount: selectCondition,
      campaign: selectCampaign,
      type: selectCategory,
      category: conditionCate,
      specialAmount: conditionAdd
    }
    // find
    const findDiscount = discountApply.filter(discount => discount.type === selectCategory)
    if (findDiscount.length === 1) {
      setDisCountApply((prevItems) =>
        prevItems.map((item) =>
          item.type === selectCategory ? applyDis : item
        ))
    } else {
      setDisCountApply(prev => [...prev, applyDis])
    }
    setSelectCondition(0)
    setConditionAdd(0)
    setConditionCate('')
    alert(`ใช้ส่วนลดเรียบร้อย`);
    return
  };

  const handleDeleteDiscount = (type: string) => {
    const updatedItems = discountApply.filter(item => item.type !== type);
    setDisCountApply(updatedItems)
    alert(`ลบส่วนลดประเภท ${type} เรียบร้อย`)
  }

  const discount = calculateDiscount(total, discountApply, initialCart);
  const finalTotal = total - discount.totalDiscount;

  console.log('discountApply: ', discountApply)
  console.log('discount: ', discount)

  return (
    <div className="layout">
      <h2>Shopping Cart</h2>
      <div className='container'>
        {initialCart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className='discount'>
        <h3>Please select discount</h3>
        <div className='cart-select-discount'>
          <div className='discount-form'>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor='category'>Select Category:</label>
                <select
                  id="category"
                  value={selectCategory}
                  onChange={(e) => {
                    setSelectCategory(e.target.value)
                    setSelectCampaign('')
                  }}
                >
                  <option value="">-- please select --</option>
                  <option value="Coupon">Coupon</option>
                  <option value="OnTop">OnTop</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>
              <div>
                <label htmlFor="campaign">Select Campaign:</label>
                <select
                  id="campaign"
                  value={selectCampaign}
                  onChange={(e) => setSelectCampaign(e.target.value)}
                >
                  <option value="">-- please select --</option>
                  {
                    selectCategory === 'Coupon' ? (
                      <>
                        <option value="Fixed" >Fixed</option>
                        <option value="Percentage" >Percentage</option>
                      </>
                    ) : null
                  }
                  {
                    selectCategory === 'OnTop' ? (
                      <>
                        <option value="PercentageByCategory">PercentageByCategory</option>
                        <option value="Point">Point</option>
                      </>
                    ) : null
                  }
                  {
                    selectCategory === 'Seasonal' ? (
                      <>
                        <option value="Special">Special</option>
                      </>
                    ) : null
                  }
                </select>
              </div>
              {
                selectCampaign ?
                  <div className='condition'>
                    <label htmlFor="condition">Condition:</label>
                    <input
                      type="text"
                      id="condition"
                      value={selectCondition}
                      onChange={(e) => {
                        const value = e.target.value;
                        // แปลงค่าให้เป็นตัวเลข ถ้ากรอกค่าที่ไม่ใช่ตัวเลขจะเป็น NaN
                        const parsedValue = value ? parseInt(value) : 0;
                        setSelectCondition(parsedValue)
                      }}
                      placeholder="กรอกข้อมูล"
                    />
                    {selectCampaign === 'Point' ? 'แต้ม' : String(selectCampaign).includes('Percentage') ? '%' : 'บาท'}
                    {
                      selectCampaign === 'Special' ?
                        <>
                          <span>ทุก</span>
                          <input
                            type="text"
                            id="condition"
                            value={conditionAdd}
                            onChange={(e) => {
                              const value = e.target.value;
                              // แปลงค่าให้เป็นตัวเลข ถ้ากรอกค่าที่ไม่ใช่ตัวเลขจะเป็น NaN
                              const parsedValue = value ? parseInt(value) : 0;
                              setConditionAdd(parsedValue)
                            }}
                            placeholder="กรอกข้อมูล"
                          />
                          บาท
                        </>
                        :
                        null
                    }
                    {
                      selectCampaign === 'PercentageByCategory' ?
                        <>
                          <span>ใน category</span>
                          <select
                            value={conditionCate}
                            onChange={(e) => {
                              const value = e.target.value;
                              setConditionCate(value)
                            }}
                          >
                            <option value="">-- please select --</option>
                            <option value="Electronic">Electronic</option>
                            <option value="Food">Food</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Accessories">Accessories</option>
                          </select>
                        </>
                        :
                        null
                    }
                  </div>
                  : null
              }
              <button className="btn-discount"
                type="submit"
              >
                Apply
              </button>
            </form>
          </div>
        </div>
      </div>
      <h3>Now use discount</h3>
      <div className='discount-used'>
        {
          discountApply.map(discount => {
            return <div className={`discount-item ${discount.type === 'Coupon' ? 'coupon' : discount.type === 'OnTop' ? 'on-top' : 'seasonal'}`}>
              <p>{discount.type}</p>
              <p>{discount.campaign}</p>
              <p>
                ส่วนลด {discount.amount.toLocaleString()} {discount.campaign === 'Point' ? 'แต้ม' : String(discount.campaign).includes('Percentage') ? '%' : 'บาท'}
              </p>
              {discount.category ?
                <p>ในหมวด {discount.category}</p> : null
              }
              {
                discount.specialAmount ?
                  <p>ทุก {discount.specialAmount} บาท</p> : null
              }
              <button className='btn-secondary' onClick={() => handleDeleteDiscount(discount.type)}>ลบ</button>
            </div>
          })
        }
      </div>
      <div className='cart-summary'>
        <p>Subtotal: {total.toFixed(2)} บาท</p>
        <p >Total Discount: - {discount.totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</p>
        <p >Final Total: {Number(finalTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</p>
      </div>
      <button >Checkout</button>
    </div >
  );
}
