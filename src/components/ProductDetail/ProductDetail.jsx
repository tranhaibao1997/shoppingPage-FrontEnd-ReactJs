import React, { useEffect, useState, forwardRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import formatPrice from '../../format'
import update from 'immutability-helper';
import { useToasts, ToastProvider } from 'react-toast-notifications'
import Slider from "react-slick";
import StarRatings from 'react-star-ratings';
import Loading from '../Loading/Loading';
import axios from 'axios'



export default function ProductDetail(props) {

  console.log(props, "propddd")

  //useEffect
  useEffect(() => {

    window.scrollTo(0, 0);
    props.getProductDetailById(id);
  }, []);
  useEffect(() => {
    // returned function will be called on component unmount 
    return () => {
      props.getProductDetailEmpty();
    }
  }, [])


  console.log(props.data)


  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  const param = useParams();
  const id = param.id;
  const { addToast } = useToasts()
  function showAlertSuccess() {
    addToast("Thêm vào giỏ hàng thành công", {
      appearance: 'success',
      autoDismiss: true, autoDismissTimeout: 2000
    })
  }



  //set tab active



  const product = props.data;
  const relatedArray = props.related

  const cart = [...props.cartdata]
  const favorite = [...props.favoritedata]
  const [inputValue, setInputValue] = useState(1);
  const [attribute1, setAttribute1] = useState("");
  const [attribute2, setAttribute2] = useState("");
  const [tabActive, setTabActive] = useState("description")





  //set btn active
  const [ActiveAttribute1Btn, setActiveAttribute1Btn] = useState(-1);
  const [ActiveAttribute2Btn, setActiveAttribute2Btn] = useState(-1);
  function setActiveAttribute1(value) {
    setActiveAttribute1Btn(value);
    if (product.attribute[0].value[value].value) {
      return setAttribute1(product.attribute[0].value[value].value)
    }
    else {
      setAttribute1(product.attribute[0].value[value].name)
    }

  }
  function setActiveAttribute2(value) {
    setActiveAttribute2Btn(value);
    setAttribute2(product.attribute[1].value[value].name)
    if (product.attribute[1].value[value].value) {
      return setAttribute2(product.attribute[1].value[value].value)
    }
    else {
      setAttribute2(product.attribute[1].value[value].name)
    }
  }
  const onClickTab = (name) => {
    setTabActive(name)
  }
  // set quantity -
  function minus(e) {

    if (inputValue > 0) {
      let a = inputValue;
      let a1 = a - 1;
      setInputValue(a1);

    }
    else {
      setInputValue(0);
    }
    console.log(document.getElementById("quantity-input").value)
  }

  // set quantity +
  function plus() {
    let a = inputValue;
    let a1 = a + 1;
    setInputValue(a1);

  }

  //add to Cart
  function addToCart() {

    const value = inputValue; //quantity trong input
    let i = cart.findIndex(a => a.name === product.name) //tim index trong cart
    if (i !== -1) //neu index khac -1 => product da co trong item
    {
      // product khac att voi product trong cart
      if (cart[i].attribute1 !== attribute1 || cart[i].attribute2 !== attribute2) {
        console.log("bi khac chi pu r kia")


        // const deepClone = update(product, { cartQuantity: { $set: value }, attribute1: { $set: attribute1 }, attribute2: { $set: attribute2 } });
        // console.log(deepClone, "object");
        // const newProductsArray1 = [...cart];// ra mang
        // newProductsArray1.push(deepClone) // sai khuc này 
        // console.log(newProductsArray1, "bug here")
        const _product = [
          ...cart,
          {
            ...product,
            attribute1,
            attribute2,
            cartQuantity: value
          }
        ]
        props.getCartSuccess(_product) //add product vao mang 
        showAlertSuccess();
        setInputValue(1);


      }

      //product trung toan bo 
      else if (product.attribute1 === attribute1 && product.attribute2 === attribute2) {
        const newProductsArray = [...cart];
        newProductsArray[i].cartQuantity = newProductsArray[i].cartQuantity + value; //+ quantity vào product da co san
        props.getCartSuccess(newProductsArray);
        showAlertSuccess()
        setInputValue(1);



      }
    }
    else {
      product.cartQuantity = value;
      product.attribute1 = attribute1;
      product.attribute2 = attribute2;
      const newProductsArray = [...cart];
      props.getCartSuccess([...newProductsArray, product])
      showAlertSuccess()
      setInputValue(1);




    }

    console.log(cart, "cart from detail ")
  }


  // - Xét trong cart
  // Có item trong cart
  // 1.Nếu  




  // Không có item trong cart


  // const [rating,setRating]=React.useState(product.rating_info.percent_star)
  // function changeRating( newRating,name ) {
  //   setRating(newRating)
  // }

  //add to Favorite
  function addToFavorite() {

    // let i = localStorage.findIndex(a => a.name === product.name)
    // if (i !== -1) {
    //   alert("Đã có item này trong danh sách yêu thích")
    // }
    // else {

    //   const newProductsArray = [...favorite];
    //   props.getFavoriteSuccess([...newProductsArray, product])
    // }




  }
  //add slideshow







  if (!product) {
    return <Loading></Loading>
  }

  //add size,color
  //   const showProp = (product) => {
  //     return product.attribute.map((attribute, key) => {
  //       return (

  //       <li key={key}><span><b>{attribute.name}:</b></span>
  //         {
  //           //value.value= attribute
  //           attribute.value.map((data, keyAtr) => { return <a href="#dss" key={key[keyAtr]} type="button" className={'btn btn-warning btn-color'} onClick={(a,b) => setActiveClass(key,keyAtr)}  >{data.value ? data.value : data.name}</a> })
  //         }

  //       </li>)


  //     })
  //   }
  // console.log(product.attribute[0].value)

  function Reload(value) {
    props.getProductDetailById(value);
    window.scrollTo(0, 0);
  }


  return (
    <div>
      <section className="shop-details-area pt-100 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-4">

              <Slider {...settings}>
                {
                  product.images.map(elm =>

                    <div class="item"><img src={`https://media3.scdn.vn/${elm}`} alt="" /></div>
                  )
                }
              </Slider>
              <div className="row mt-5">
                <div className="col-xl-4">
                  <img style={{ borderRadius: '50%' }} src={product.shop_info.shop_logo} height="170px" alt=""></img>

                </div>

                <div className="col-xl-6 align-self-center align-items-xl-center">
                  <p className="shop-info-text">Thông tin shop</p>
                  <p>{product.shop_info.shop_name}</p>
                  <p> <b>Phản hồi tốt</b> : {product.shop_info.good_review_percent}%</p>
                  <p>  <b>Tổng điểm </b> : {product.shop_info.score}</p>
                  <p>  <b>Số điện thoại</b> : {product.shop_info.phone_number}</p>


                </div>
              </div>


            </div>
            <div className="col-xl-6 col-lg-8">
              <div className="product-details mb-30 pl-30">
                <div className="details-cat mb-20">

                  <a href="#">{product.shop_info.shop_name}</a>
                </div>
                <h2 className="pro-details-title mb-15">{product.name}</h2>
                <StarRatings
                  rating={product.rating_info.rate_percent}
                  starRatedColor="red"
                  numberOfStars={5}
                  name='rating'
                />({product.rating_info.total_rated} voted)
                <div className="details-price mb-20">
                  <span>{formatPrice(product.final_price)}đ</span>
                  <span className="old-price">{formatPrice(product.price)}đ</span>
                </div>
                <div className="product-variant">
                  <div className="product-desc variant-item">
                    <p>{product.short_description}</p>
                  </div>
                  <div className="product-info-list variant-item">
                    <ul>
                      {
                        product.attribute[0]
                          ? <li>
                            <p>{product.attribute[0].name}</p>
                            {

                              product.attribute[0].value.map((data, key) => { return <a key={key} type="button" className={ActiveAttribute1Btn === key ? "btn btn-danger btn-color active" : "btn btn-danger btn-color"} onClick={(a) => setActiveAttribute1(key)}  >{data.value ? data.value : data.name}</a> })
                            }

                          </li>
                          : <span></span>

                      }
                      {
                        product.attribute[1]
                          ? <li>
                            <p>{product.attribute[1].name}</p>
                            {

                              product.attribute[1].value.map((data, key) => { return <a key={key} type="button" className={ActiveAttribute2Btn === key ? "btn btn-danger btn-color active" : "btn btn-danger btn-color"} onClick={(a) => setActiveAttribute2(key)}  >{data.value ? data.value : data.name}</a> })
                            }

                          </li>
                          : <span></span>

                      }
                      <li><span>Stock:</span> <span className="in-stock">{product.quantity}</span></li>
                    </ul>
                    <div dangerouslySetInnerHTML={{ __html: product.refund_info.tooltip }} />
                    <div dangerouslySetInnerHTML={{ __html: product.return_exchange_free.tooltip }} />
                    <span><img src={product.campaign_list.icon} alt=""></img></span>

                    <div dangerouslySetInnerHTML={{ __html: product.campaign_list.description }} />
                  </div>
                  <div className="product-action-details variant-item">
                    <div className="product-details-action">
                      <form>
                        <div className="plus-minus">
                          <div className="cart-plus-minus">
                            <input id="quantity-input" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                            <div className="dec qtybutton" onClick={minus}>-</div>
                            <div className="inc qtybutton" onClick={plus}>+</div></div>
                        </div>
                        <button className="details-action-icon" type="button" onClick={addToFavorite}><i className="fas fa-heart" /></button>
                        <div className="details-cart mt-40">
                          {
                            product.attribute.length === 2
                              ? attribute1 === '' || attribute2 === ''
                                ? <button type="button" className="btn theme-btn" disabled onClick={addToCart}>purchase now</button>
                                : <button type="button" className="btn theme-btn" onClick={addToCart}>purchase now</button>
                              : attribute1 === ''
                                ? <button type="button" className="btn theme-btn" disabled onClick={addToCart}>purchase now</button>
                                : <button type="button" className="btn theme-btn" onClick={addToCart}>purchase now</button>
                          }


                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="area-title text-center mb-50">
            <h2>Related Products</h2>
            <p>Browse the huge variety of our products</p>
          </div>

          <div className="related" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {

              props.data.product_relateds.map(elm => {
                return (
                  <div className="col-xl-3 col-lg-4 col-md-4" >
                    <div className="product-wrapper mb-50">
                      <div className="product-img mb-25">
                        <Link to={`/product-detail/${elm.id}`} onClick={(a) => Reload(elm.id)}>
                          <img src={`https://media3.scdn.vn/${elm.images[0]}`} alt="" />

                        </Link>

                      </div>
                      <div className="product-content pr-0">
                        <StarRatings
                          rating={elm.rating_info.rate_percent}
                          starRatedColor="red"
                          numberOfStars={5}
                          name='rating'
                          starDimension='20px'
                        /> ({elm.rating_info.total_rated} votes)
              <div className="pro-cat mb-10">
                          <a href="#">{elm.shop_name}</a>
                        </div>
                        <h4>
                          <a href="#">{elm.name}</a>
                        </h4>
                        <div className="product-meta">
                          <div className="pro-price">
                            <span>{formatPrice(elm.final_price)}đ</span>
                            <span className="old-price">{formatPrice(elm.price)}đ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
          <div className="row mt-50">
            <div className="col-xl-8 col-lg-8">
              <div className="product-review">
                <ul className="nav review-tab" id="myTabproduct" role="tablist">
                  <li className="nav-item">
                    <a
                      className={`nav-link ${tabActive === "description" && "active"}`}
                      id="home-tab6"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="home"
                      aria-selected="true"
                      onClick={() => onClickTab("description")}
                    >
                      Description{" "}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${tabActive === "comments" && "active"}`}
                      id="profile-tab6"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="profile"
                      aria-selected="false"
                      onClick={() => onClickTab("comments")}
                    >
                      Reviews (2)
                    </a>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent2">
                  <div
                    className={`tab-pane fade show ${tabActive === "description" && "active"}`}
                    id="home6"
                    role="tabpanel"
                    aria-labelledby="home-tab6"
                  >
                    <div className="desc-text">
                      <p dangerouslySetInnerHTML={{ __html: product.description }} />


                    </div>
                  </div>
                  <div
                    className={`tab-pane fade show ${tabActive === "comments" && "active"}`}
                    id="profile6"
                    role="tabpanel"
                    aria-labelledby="profile-tab6"
                    style={{ display: 'block' }}
                  >
                    <div className="desc-text review-text">
                      <div className="product-commnets">
                        <div className="product-commnets-list mb-25 pb-15">
                          <div className="pro-comments-img">
                            <img src="img/product/comments/01.png" alt="" />
                          </div>
                          <div className="pro-commnets-text">
                            <h4>
                              Roger West -<span>June 5, 2018</span>
                            </h4>
                            <div className="pro-rating">
                              <i className="far fa-star" />
                              <i className="far fa-star" />
                              <i className="far fa-star" />
                              <i className="far fa-star" />
                            </div>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit, sed do eiusmod tempor incididunt
                              ut labore et dolore magna aliqua. Ut enim ad minim
                              veniam, quis nostrud exercitation.
                            </p>
                          </div>
                        </div>
                        <div className="product-commnets-list mb-25 pb-15">
                          <div className="pro-comments-img">
                            <img src="img/product/comments/02.png" alt="" />
                          </div>
                          <div className="pro-commnets-text">
                            <h4>
                              Roger West -<span>June 5, 2018</span>
                            </h4>
                            <div className="pro-rating">
                              <i className="far fa-star" />
                              <i className="far fa-star" />
                              <i className="far fa-star" />
                              <i className="far fa-star" />
                            </div>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit, sed do eiusmod tempor incididunt
                              ut labore et dolore magna aliqua. Ut enim ad minim
                              veniam, quis nostrud exercitation.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="review-box mt-50">
                        <h4>Add a Review</h4>
                        <div className="your-rating mb-40">
                          <span>Your Rating:</span>
                          <div className="rating-list">
                            <a href="#">
                              <i className="far fa-star" />
                            </a>
                            <a href="#">
                              <i className="far fa-star" />
                            </a>
                            <a href="#">
                              <i className="far fa-star" />
                            </a>
                            <a href="#">
                              <i className="far fa-star" />
                            </a>
                            <a href="#">
                              <i className="far fa-star" />
                            </a>
                          </div>
                        </div>
                        <form className="review-form" action="#">
                          <div className="row">
                            <div className="col-xl-12">
                              <label htmlFor="message">YOUR REVIEW</label>
                              <textarea
                                name="message"
                                id="message"
                                cols={30}
                                rows={10}
                                defaultValue={""}
                              />
                            </div>
                            <div className="col-xl-6">
                              <label htmlFor="r-name">Name</label>
                              <input type="text" id="r-name" />
                            </div>
                            <div className="col-xl-6">
                              <label htmlFor="r-email">Email</label>
                              <input type="email" id="r-email" />
                            </div>
                            <div className="col-xl-12">
                              <button className="btn theme-btn">
                                Add your Review
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4">
              <div className="pro-details-banner">
                <a href="shop.html">
                  <img src="img/banner/pro-details.jpg" alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* shop-area end */}
      {/* product-area start */}
      <section className="product-area pb-100">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">

            </div>
          </div>
          <div className="product-slider-2 owl-carousel">
            <div className="pro-item">
              <div className="product-wrapper">
                <div className="product-img mb-25">
                  <a href="product-details.html">
                    <img src="img/product/pro4.jpg" alt="" />
                    <img className="secondary-img" src="img/product/pro5.jpg" alt="" />
                  </a>
                  <div className="product-action text-center">
                    <a href="#" title="Shoppingb Cart">
                      <i className="flaticon-shopping-cart" />
                    </a>
                    <a href="#" title="Quick View">
                      <i className="flaticon-eye" />
                    </a>
                    <a href="#" data-toggle="tooltip" data-placement="right" title="Compare">
                      <i className="flaticon-compare" />
                    </a>
                  </div>
                </div>
                <div className="product-content">
                  <div className="pro-cat mb-10">
                    <a href="shop.html">decor, </a>
                    <a href="shop.html">furniture</a>
                  </div>
                  <h4>
                    <a href="product-details.html">Raglan Baseball Style shirt</a>
                  </h4>
                  <div className="product-meta">
                    <div className="pro-price">
                      <span>$119.00 USD</span>
                      <span className="old-price">$230.00 USD</span>
                    </div>
                  </div>
                  <div className="product-wishlist">
                    <a href="#"><i className="far fa-heart" title="Wishlist" /></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="pro-item">
              <div className="product-wrapper">
                <div className="product-img mb-25">
                  <a href="product-details.html">
                    <img src="img/product/pro5.jpg" alt="" />
                    <img className="secondary-img" src="img/product/pro6.jpg" alt="" />
                  </a>
                  <div className="product-action text-center">
                    <a href="#" title="Shoppingb Cart">
                      <i className="flaticon-shopping-cart" />
                    </a>
                    <a href="#" title="Quick View">
                      <i className="flaticon-eye" />
                    </a>
                    <a href="#" data-toggle="tooltip" data-placement="right" title="Compare">
                      <i className="flaticon-compare" />
                    </a>
                  </div>
                  <div className="sale-tag">
                    <span className="new">new</span>
                    <span className="sale">sale</span>
                  </div>
                </div>
                <div className="product-content">
                  <div className="pro-cat mb-10">
                    <a href="shop.html">decor, </a>
                    <a href="shop.html">furniture</a>
                  </div>
                  <h4>
                    <a href="product-details.html">Raglan Baseball Style shirt</a>
                  </h4>
                  <div className="product-meta">
                    <div className="pro-price">
                      <span>$119.00 USD</span>
                      <span className="old-price">$230.00 USD</span>
                    </div>
                  </div>
                  <div className="product-wishlist">
                    <a href="#"><i className="far fa-heart" title="Wishlist" /></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="pro-item">
              <div className="product-wrapper">
                <div className="product-img mb-25">
                  <a href="product-details.html">
                    <img src="img/product/pro7.jpg" alt="" />
                    <img className="secondary-img" src="img/product/pro8.jpg" alt="" />
                  </a>
                  <div className="product-action text-center">
                    <a href="#" title="Shoppingb Cart">
                      <i className="flaticon-shopping-cart" />
                    </a>
                    <a href="#" title="Quick View">
                      <i className="flaticon-eye" />
                    </a>
                    <a href="#" data-toggle="tooltip" data-placement="right" title="Compare">
                      <i className="flaticon-compare" />
                    </a>
                  </div>
                </div>
                <div className="product-content">
                  <div className="pro-cat mb-10">
                    <a href="shop.html">decor, </a>
                    <a href="shop.html">furniture</a>
                  </div>
                  <h4>
                    <a href="product-details.html">Raglan Baseball Style shirt</a>
                  </h4>
                  <div className="product-meta">
                    <div className="pro-price">
                      <span>$119.00 USD</span>
                      <span className="old-price">$230.00 USD</span>
                    </div>
                  </div>

                  <div className="product-wishlist">
                    <a href="#"><i className="far fa-heart" title="Wishlist" /></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="pro-item">
              <div className="product-wrapper">
                <div className="product-img mb-25">
                  <a href="product-details.html">
                    <img src="img/product/pro9.jpg" alt="" />
                    <img className="secondary-img" src="img/product/pro10.jpg" alt="" />
                  </a>
                  <div className="product-action text-center">
                    <a href="#" title="Shoppingb Cart">
                      <i className="flaticon-shopping-cart" />
                    </a>
                    <a href="#" title="Quick View">
                      <i className="flaticon-eye" />
                    </a>
                    <a href="#" data-toggle="tooltip" data-placement="right" title="Compare">
                      <i className="flaticon-compare" />
                    </a>
                  </div>
                  <div className="sale-tag">
                    <span className="new">new</span>
                    <span className="sale">sale</span>
                  </div>
                </div>
                <div className="product-content">
                  <div className="pro-cat mb-10">
                    <a href="shop.html">decor, </a>
                    <a href="shop.html">furniture</a>
                  </div>
                  <h4>
                    <a href="product-details.html">Raglan Baseball Style shirt</a>
                  </h4>
                  <div className="product-meta">
                    <div className="pro-price">
                      <span>$119.00 USD</span>
                      <span className="old-price">$230.00 USD</span>
                    </div>
                  </div>
                  <div className="product-wishlist">
                    <a href="#"><i className="far fa-heart" title="Wishlist" /></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="pro-item">
              <div className="product-wrapper">
                <div className="product-img mb-25">
                  <a href="product-details.html">
                    <img src="img/product/pro1.jpg" alt="" />
                    <img className="secondary-img" src="img/product/pro11.jpg" alt="" />
                  </a>
                  <div className="product-action text-center">
                    <a href="#" title="Shoppingb Cart">
                      <i className="flaticon-shopping-cart" />
                    </a>
                    <a href="#" title="Quick View">
                      <i className="flaticon-eye" />
                    </a>
                    <a href="#" data-toggle="tooltip" data-placement="right" title="Compare">
                      <i className="flaticon-compare" />
                    </a>
                  </div>
                  <div className="sale-tag">
                    <span className="new">new</span>
                    <span className="sale">sale</span>
                  </div>
                </div>
                <div className="product-content">
                  <div className="pro-cat mb-10">
                    <a href="shop.html">decor, </a>
                    <a href="shop.html">furniture</a>
                  </div>
                  <h4>
                    <a href="product-details.html">Raglan Baseball Style shirt</a>
                  </h4>
                  <div className="product-meta">
                    <div className="pro-price">
                      <span>$119.00 USD</span>
                      <span className="old-price">$230.00 USD</span>
                    </div>
                  </div>
                  <div className="product-wishlist">
                    <a href="#"><i className="far fa-heart" title="Wishlist" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* product-area end */}
    </div>
  )
}