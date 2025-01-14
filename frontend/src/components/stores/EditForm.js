import { ImportExport } from '@material-ui/icons'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import {productType, productGroup} from '../../mocks/category'
import myUrl from '../../domain'
import Switch from '@mui/material/Switch';

const Container = styled.div`
    padding: 40px;
`

const Head = styled.div`

`

const Title = styled.div`
    font-size: 22px;
`

const SubTitle = styled.div`
    font-size: 12px;
    color: #999;
`

const ProductName = styled.div`
    display: flex;
`

const ProductDescribe = styled.div`
    display: flex;
    margin-top: 20px;
`

const ProductPrice = styled.div`
    display: flex;
    margin-top: 20px;
`

const ProductRest = styled.div`
    display: flex;
    margin-top: 20px;
`

const ProductImg = styled.div`
    display: flex;
    margin-top: 20px;
`

const Active = styled.div`
    display: flex;
    margin-top: 20px;
`

const Label = styled.label`
    font-size: 14px;
    margin-right: 15px;
    align-self: center;
    min-width: 100px;
`

const Input = styled.input`
    flex: 1;
    padding: 7px 10px;
    outline: none;
    border: solid 1px #ccc;
    border-radius: 3px;
`

const Category = styled.div`
    background: #fafafa;
    padding: 24px;
    display: flex;
    justify-content: center;
    margin: 30px 0;
`

const CategoryGroup = styled.div`
    background: #fff;
    width: 300px;
    height: 320px;
    overflow-y: scroll;
`

const CategoryItem = styled.div`
    margin: 10px 0;
    padding: 0 20px;
    cursor: pointer;
    width: 100%;
    line-height: 30px;
    &:hover{
        background: #f6f6f6;
    }
    &.active{
        font-weight: bold;
    }
`

const Selected = styled.div`
    & span:nth-child(2){
        font-weight: bold;
    }
`

const Confirm = styled.div`
    padding: 8px 13px;
    margin: 10px 0;
    border-radius: 3px;
    background-color: #000;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    float: right;
    &:hover{
        opacity: 0.8;
        transition: 0.3;
    }
    width: fit-content;
`

const TitleForm = styled.div`
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin: 5px 0;
`

function EditForm({product}) {
    console.log(product)
    const [group, setGroup] = useState(productGroup[0]);
    const [type, setType] = useState({});

    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [describe, setDescribe] = useState(product.descriptions);
    const [rest, setRest] = useState(product.rest);
    const [img, setImg] = useState(product.linkImg);
    const [active, setActive] = useState(product.status == "active"?true:false);

    useEffect(()=>{
        setName(product.name);
        setPrice(product.price);
        setDescribe(product.descriptions);
        setRest(product.rest);
        setImg(product.linkImg);
        productType.forEach(item => {
            if (item.id == product.lsp){
                setType(item);
                productGroup.forEach(item2 => {
                    if (item2.id == item.idProductGroup){
                        setGroup(item2);
                    }
                })
            }
        })
    }, [product])


    const HandleSubmit = ()=>{
        let data = {
            productId: product.id,
            name,
            price,
            descriptions: describe,
            rest,
            linkImg: img,
            status: active,
        }

        axios({
            method: 'post',
            url: `${myUrl}/products/products/update`,
            data
        })
            .then(function (res) {
                console.log(res)
            })
            .catch(function (err) {
                console.log(err);
            });
        
        window.location = "/store/products"
    }

  return (
    <div>
        <TitleForm>CHỈNH SỬA SẢN PHẨM</TitleForm>
        <ProductName>
            <Label htmlFor='name'>Tên sản phẩm:</Label>
            <Input id='name' placeholder='Nhập vào' value={name} onChange={(e)=>{setName(e.target.value)}}/>
        </ProductName>
        <ProductDescribe>
            <Label htmlFor='describe'>Mô tả:</Label>
            <Input id='describe' placeholder='Nhập vào' value={describe} onChange={(e)=>{setDescribe(e.target.value)}}/>
        </ProductDescribe>
        <ProductPrice>
            <Label htmlFor='price'>Giá sản phẩm:</Label>
            <Input id='price' placeholder='Nhập vào' type={"number"} value={price} onChange={(e)=>{setPrice(e.target.value)}}/>
        </ProductPrice>
        <ProductRest>
            <Label htmlFor='rest'>Tồn kho:</Label>
            <Input id='rest' placeholder='Nhập vào' type={"number"} value={rest} onChange={(e)=>{setRest(e.target.value)}}/>
        </ProductRest>
        <ProductImg>
            <Label htmlFor='img'>Hình ảnh:</Label>
            <Input id='img' placeholder='Nhập vào' type={"text"} value={img} onChange={(e)=>{setImg(e.target.value)}}/>
        </ProductImg>
        <Active>
            <Label>Hoạt động:</Label>
            <Switch defaultChecked={active?true:false} onChange={(e)=>{e.target.checked?setActive("active"):setActive("inactive")}}/>
        </Active>
        <Category>
            <CategoryGroup>
                {productGroup.map((item, index)=>(
                    <CategoryItem className={item.id == group.id?"active":""} key={index} onClick={()=>{setGroup(item); setType({})}}>{item.name}</CategoryItem>
                ))}
            </CategoryGroup>
            <hr />
            <CategoryGroup>
                {productType.map((item, index)=>{
                    if (item.idProductGroup == group.id){
                        return <CategoryItem className={item.id == type.id?"active":""} key={index} onClick={()=>{setType(item)}}>{item.name}</CategoryItem>
                    }
                })}
            </CategoryGroup>
        </Category>
        <Selected>
            <span>Đã chọn: </span>
            <span>{group.name} / {type.name}</span>
        </Selected>
        <Confirm onClick={(e)=>{e.stopPropagation(); HandleSubmit()}}>Xác Nhận</Confirm>
    </div>
  )
}

export default EditForm