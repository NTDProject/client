import React, { Component } from 'react';
import { connect } from 'react-redux';

import ReactTable from "react-table-v6";
import "react-table-v6/react-table.css";
import { getData, saveCampaign, checkSaveCampaign } from './actions';
import { Save } from '@material-ui/icons/';
import { Button, Grid, Typography, Divider } from "@material-ui/core/";
import DatePicker from "react-datepicker";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import "react-datepicker/dist/react-datepicker.css";


class Manager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      giaidoanhientai: "",
      giaidoansau:"",
      giaidoanhientai_id: "",
      giaidoansau_id:"",
      ngayBatDau: new Date(),
      ngayKetThuc: new Date(),
      tenChienDich: "",
      ListViTri: [],
      idChienDich: ""
    }
  }
  componentDidMount() {
    let value = this.props.route.location.state.id
    if(value== null){
      value = "addPage"
      
    }
    this.setState({
      idChienDich : value
    })
    this.props.getData(value,this.after)
  }


  after = (resp) => {
    let ngayBatDau = (resp.ngay_batdau.split("-"))
    let ngayKetThuc = (resp.ngay_ketthuc.split("-"))
    this.setState({
      tenChienDich: resp.ten_chiendich,
      ngayBatDau: new Date(ngayBatDau[0],ngayBatDau[1]-1,ngayBatDau[2]),
      ngayKetThuc: new Date(ngayKetThuc[0],ngayKetThuc[1]-1,ngayKetThuc[2]),
      giaidoanhientai: resp.giaidoanhientai,
      giaidoansau: resp.giaidoansau,
      giaidoanhientai_id: resp.giaidoanhientai_id,
      giaidoansau_id: resp.giaidoansau_id,
      ListViTri: resp.ListViTri,
    })

  }

  handleChangeNgayBatDau = date => {
    this.setState({
      ngayBatDau: date
    });
  };
  handleChangeNgayKetThuc = date => {
    this.setState({
      ngayKetThuc: date
    });
  };

  handleChangeInputText= e => {
    let name = e.target.name
    let value = e.target.value
    this.setState({
      [name]: value
    });
  };
  handleChangeInputOnCell = value => {
    let viTri = this.state.ListViTri
    viTri.map(vt => {
      if(vt.vitri_id == value._original.vitri_id){
        vt.soluong = document.getElementById(value._original.vitri_id).value
      }
    })
    this.setState({
      ListViTri: viTri
    })
  }

  save = () => {
    const {tenChienDich, ngayBatDau, ngayKetThuc} = this.state
    let isAdd = this.state.idChienDich=="addPage"?true:false
    let canTuyen = 0

    this.state.ListViTri.map(vt => {
      if(vt.soluong != null && vt.soluong != undefined && vt.soluong != ''){
        canTuyen += vt.soluong;
      }
    })

    if(tenChienDich == null || tenChienDich == undefined || tenChienDich == ""){
      toast("Không được để trống tên chiến dịch")
    }
    else if(ngayBatDau == null || ngayBatDau == undefined || ngayBatDau == ''){
      toast("Không được để trống ngày bắt đầu")
    }
    else if(ngayKetThuc == null || ngayKetThuc == undefined || ngayKetThuc == ''){
      toast("Không được để trống ngày kết thúc")
    }
    else if(canTuyen <= 0){
      toast("Số lượng cần tuyển phải lớn hơn 0")
    }
    else{
      const{ngayBatDau, ngayKetThuc, tenChienDich, ListViTri, idChienDich} = this.state
      let value = {
        chiendich_id: idChienDich,
        ten_chiendich: tenChienDich,
        ngay_batdau: ngayBatDau,
        ngay_ketthuc: ngayKetThuc,
        trangthai:"",
        mota:"",
        ListViTri: ListViTri
      }

      this.props.checksave(value,this.afterCheckSave)
    }
  }

  afterCheckSave = (resp) => {
    const{ngayBatDau, ngayKetThuc, tenChienDich, ListViTri, idChienDich} = this.state
    let value = {
      chiendich_id: idChienDich,
      ten_chiendich: tenChienDich,
      ngay_batdau: ngayBatDau,
      ngay_ketthuc: ngayKetThuc,
      trangthai:"",
      mota:"",
      ListViTri: ListViTri
    }
    if(!resp.status){
      toast(resp.message)
    }
    else{
      this.props.save(value,this.afterSave)
      }
  }

  afterSave = (resp) => {
    console.log(resp)
    toast(resp.message)

  }

  tranfer = () => {
    this.props.history.push({pathname:'/campaign/tranfer',state:{ListVitri: this.state.ListViTri, chiendich_id: this.state.idChienDich, giaidoanhientai: this.state.giaidoanhientai, giaidoansau: this.state.giaidoansau, giaidoanhientai_id: this.state.giaidoanhientai_id, giaidoansau_id: this.state.giaidoansau_id, ten_chiendich: this.state.tenChienDich}});
  }


  back = () => {
    let path = `/campaign`;
    this.props.history.push({pathname:path,state:{}});
  }
  render() {
    
    return (

      <div style={{ margin: "20px" }}>
        <ToastContainer />
        <div style={{ padding: "20px" }}>
          <Typography variant="subtitle1" gutterBottom>
            Thông tin chung:
      </Typography>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <span style={{ marginRight: "50px" }}>Tên chiến dịch:</span>
            </Grid>
            <Grid item xs={3}>
              <input type="text" name="tenChienDich" value = {this.state.tenChienDich} onChange = {this.handleChangeInputText}/>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <span style={{ marginRight: "50px" }}>Giai đoạn:</span>
            </Grid>
            <Grid item xs={4}>
              <input type="text" name="giaidoanhientai" value = {this.state.giaidoanhientai} />
            </Grid>
            <Grid item xs={2}>
              <span style={{ marginRight: "50px" }}>Ngày bắt đầu:</span>
            </Grid>
            <Grid item xs={3}>
              <DatePicker
                name="ngayBatDau"
                selected={this.state.ngayBatDau}
                onChange={this.handleChangeNgayBatDau}
                dateFormat="dd/MM/yyyy"
              />
            </Grid>

            <Grid item xs={1}></Grid>
            <Grid item xs={2}>
              <span style={{ marginRight: "50px" }}>Ngày kết thúc:</span>
            </Grid>
            <Grid item xs={4}>
              <DatePicker
                name="ngayKetThuc"
                selected={this.state.ngayKetThuc}
                onChange={this.handleChangeNgayKetThuc}
                dateFormat="dd/MM/yyyy"
              />
            </Grid>
            <Grid item xs={2}></Grid>

          </Grid>
        </div>
        <Divider />
        <div style={{ padding: "20px" }}>
          <Typography variant="subtitle1" gutterBottom>
            Vị trí tuyển dụng :
          </Typography>
          <Grid container spacing={3}>
          <ReactTable
          style = {{width: "98%", margin:"10px"}}
          showPagination={false}
          sortable={false}
          data={this.state.ListViTri}
          pageSize={this.state.ListViTri.length>0?this.state.ListViTri.length:5}
          columns={[
            {
              Header: "Tên",
              accessor: "ten_vitri",

            },
            {
              Header: "Số lượng",
              accessor: "soluong",
              Cell: (props) => 
              <div style = {{textAlign: "center"}}>
                <input type = "number" id = {props.row._original.vitri_id} onBlur = {() => this.handleChangeInputOnCell(props.row)}  defaultValue = {props.value}/>
              </div>,
              width: 150
            },

           
            
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
          </Grid>
        </div>
        <Divider />
        <div style ={{textAlign: "center", margin: "20px"}}>
        <Button variant="contained" color="secondary" onClick = {this.save}>
          <Save/>{' '}Lưu
        </Button> {' '}
        <Button variant="contained" color="secondary" onClick = {this.tranfer}>
          Chuyển giai đoạn
        </Button>{' '}
        <Button variant="contained" color="secondary" onClick = {this.back}>
          Quay lại
        </Button>
        </div>
        <Divider />
      </div>

    );

  }
}


const mapStateToProps = (state) => {
};

const mapDispatchToProps = (dispatch) => {
  return {
    getData: (value, after) => { dispatch(getData(value, after)) },
    save: (value, after) => { dispatch(saveCampaign(value, after)) },
    checksave: (value, after) => { dispatch(checkSaveCampaign(value, after)) },
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Manager));