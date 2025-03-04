import React from "react";
import { Container, Col, Row,Button,Table } from "react-bootstrap";
import Skeleton from '@material-ui/lab/Skeleton';
import { BiShoppingBag } from "react-icons/bi";
import { useParams } from "react-router";
import { products } from "../../Data/Data";
import { IProduct } from "../../interface";
import { FaRuler } from "react-icons/fa";
import { BiHeart} from "react-icons/bi";
import {ProductSingleTabs} from "../../components";
import { useDispatch ,useSelector} from "react-redux";
import { getWishListThunk,removeProductWish } from "../../Store/reducers/wishList.reducer/wishList.reducer";
import { changeImgProduct ,changeSubImgProduct} from "../../Store/reducers/produtSingle.reducer/productSingle.reducer";
import { RootState } from "../../Store/store";
import { getProductSingleThunk } from "../../Store/reducers/produtSingle.reducer/productSingle.reducer";
import { addToCart ,updateCart,updateTotalCart} from "../../Store/reducers/product.reducer/product.reducer";
import ProductModalCart from "./ProductModalCart";
import ProductModalSizes from "./ProductModalSizes";
 


import "./ProductSinglePage.style.scss";
const ProductSinglePage = () => {
  let { id ,category_name} = useParams<{ id: string,category_name:string }>();
  const [modalShow, setModalShow] = React.useState(false);
  const [productImg, setProductImg] = React.useState<IProduct>();
  // modal cart state
  const [show, setShow] = React.useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
// add To cart
  const cart = useSelector((state:RootState)=>state.reducer.productsItems.cart)
  const {product,loading,error} = useSelector((state:RootState)=>state.reducer.productItem);
  const {wishList} = useSelector((state:RootState)=>state.reducer.wishList)

  const dispatch = useDispatch()
 

 const handleAddToCart =()=>{
  if(product) {
    if(!cart.some((item)=>item.id === product.id) || !cart.some((item)=>item.size === product.size)  ){
      dispatch(addToCart({...product,count:1,totalPrice:(product.discount) ? product.price - (product.price * product.discount) / 100 : product.price}))
    }
  }
  
  }
  const handleUpdateAddToCart =()=>{
    if(product) {
         console.log(cart.some((item)=>item.id === product.id));
        if(cart.some((item)=>item.id === product.id) && cart.some((item)=>item.size === product.size)){
          dispatch(updateCart(product.id))
          dispatch(updateTotalCart(product.id))
       }
       } 
       
  }

  React.useEffect(() => {
    setProductImg(products.find((item) => item.id === +id));
    dispatch(getProductSingleThunk({id:id,category_name:category_name}))
  }, [id]);

  React.useEffect(()=>{
    window.scrollTo(0,0)
  },[])


  const handleChangeImg = (src:string)=>{
      if(src === "img") {
        (productImg) &&  dispatch(changeImgProduct(productImg.img))
      }else{
        (productImg) &&  dispatch(changeSubImgProduct(productImg.subImg))
      }
  }
  const handleWishListAdd = (id: number) => {
    if (wishList.find((item: IProduct) => item.id === id) === undefined) {
      dispatch(getWishListThunk({ id: id }));
    } else {
      dispatch(removeProductWish(id));
    }
  };

  
  
  return (

    <>
   
      <Container>
        {
          (loading)?
            <div className="my-5">
              <Row>
                <Col lg={6}>
                <Skeleton animation="wave" variant="circle" width={40} height={40} />
               <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
               <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={10} width="80%" />
               <Skeleton animation="wave" variant="rect" style={{height:"480px"}}/>
                </Col>
                <Col lg={6}>
                <Skeleton animation="wave" variant="circle" width={40} height={40} />
               <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
               <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={10} width="80%" />
               <Skeleton animation="wave" variant="rect" style={{height:"480px"}}/>
                </Col>
              </Row>
               

         
            </div>
            :
            <Row className="py-4">
        <Col lg={6} className={"product"}>
          <div className="d-flex justify-content-center align-items-center">
            <img loading="lazy" src={product?.img} alt={product?.name} />
          </div>
          <div className={"discount-product"}>{product?.discount}%</div>
          <div className="product-bg"></div>
        </Col>
        <Col lg={6} className="pt-4 px-3">
          <div>
            <div className="d-flex justify-content-between align-items-center">
            <h4>{product?.name}</h4>
            <div className="product___heart" style={{cursor:"pointer"}}  onClick={()=>handleWishListAdd(product.id)} >
                  {
                    wishList.find((itemWish:IProduct)=>itemWish.id === product.id)
                    ?
                    <BiHeart className="mt-1" fill={"#00bf6f"}  size={39}/>
                    :
                    <BiHeart className="mt-1"  size={39} />
                  }
                </div>
            </div>
            <p className="my-3">{product?.type}</p>
            <span className="d-flex align-items-center my-4">
              <small
                className={
                  product?.discount
                    ? "text-decoration-line-through ms-4 discount "
                    : ` ms-4 discount`
                }
              >
                {product?.price} تومان
              </small>
              <p className="discount-value d-flex align-items-center m-0">
                تخفیف شما:{" "}
                <p className="discount-price m-0 me-3 ">
                  {product?.discount
                    ? (product?.price * product?.discount) / 100
                    : 0}{" "}
                  تومان
                </p>
              </p>
            </span>
            {product?.discount ? (
              <h4 className="price mb-5">
                {product.price - (product?.price * product?.discount) / 100}{" "}
                تومان
              </h4>
            ) : null}
          </div>

          <p>جهت</p>
          <div className="d-flex mb-3">
            <div className="product-arrowImg ms-3" onClick={()=>handleChangeImg("img")}>
              <img src={productImg?.img} alt={productImg?.type} />
            </div>
            <div className="product-arrowImg" onClick={()=>handleChangeImg("subImg")}>
              <img src={productImg?.subImg} alt={productImg?.type} />
            </div>
          </div>

          <div className="d-flex">
            {/* <select
              name="selectSize"
              className="single-select"
              onChange={(e)=>handleSelectSize(e)}
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XS">XS</option>
              <option value="XXL">XXL</option>
            </select> */}

            <button className="btn-size me-2 "  onClick={() => setModalShow(true)}>
              <FaRuler size={20} />
              <span className="me-2">سایز من چنده؟</span>
            </button>
          </div>
          <button className="basket my-4"   onClick={()=>{handleShow();handleAddToCart();handleUpdateAddToCart()}}>
            <BiShoppingBag size={25} />
            <span className="me-2"> افزودن به سبد خرید</span>
          </button>
          <div className="d-flex">
              <div className="d-flex align-items-center">
                  <img src="https://www.banimode.com//themes/new/assets/images/icon/15days.svg" alt="ضمانت بازگشت کالا" />
                  <small>ضمانت بازگشت کالا</small>
              </div>
              <div className="d-flex align-items-center">
                  <img src="https://www.banimode.com//themes/new/assets/images/icon/originality-light.svg" alt="ضمانت اصالت کالا" />
                  <small>ضمانت اصالت کالا</small>
              </div>
              <div className="d-flex align-items-center">
                  <img src="https://www.banimode.com//themes/new/assets/images/icon/support-light.svg" alt="ضمانت اصالت کالا" />
                  <small>   خدمات پس از فروش</small>
              </div>
              <div className="d-flex align-items-center my-5">
                  <img src="https://www.banimode.com//themes/new/assets/images/icon/delivery-light.svg" alt="  تحویل سریع و آسان" />
                  <small>     تحویل سریع و آسان </small>
              </div>
          </div>
        </Col>
        <Col>
          <ProductSingleTabs />
        </Col>
      </Row>
        }
      

      <ProductModalSizes
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
      />

        <ProductModalCart 
            show={show}
            handleShow={handleShow}
            handleClose={handleClose}
         />

    </Container>
      
    
    </>
  );
};


export default ProductSinglePage;
