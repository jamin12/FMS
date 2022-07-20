"use strict";

const passport = require("passport");
const { localStrategy } = require("./passport");
const user_model = require('../models/user.model');
const user_detail_model = require('../models/user.detail.model');

module.exports = () => {
    // 세션에 저장 로그인이 최초로 성공했을 때만 호출되는 함수
    passport.serializeUser(async (user,done)=>{
        const selected_user = await user_model.findById(user);
        if(!selected_user){
            done(null, false);
        }
        done(null,selected_user);
    });
    
    // 사용자가 페이지를 방문할 때마다 호추로디는 함수
    passport.deserializeUser((id,done)=>{
        done(null, id);
    });
    
    passport.use('local', localStrategy);
};