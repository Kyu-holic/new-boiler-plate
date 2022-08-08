import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

// eslint-disable-next-line import/no-anonymous-default-export
export default function (SpecificComponent, option, adminRoute = null) {
  // null     =>  아무나 출입이 가능한 페이지
  // true     =>  로그인한 유저만 출입이 가능한 페이지
  // false    =>  로그인한 유저는 출입 불가능한 페이지

  // SpecificComponent는 hoc를 의미
  // option은 위에 null,true,false를 의미
  // adminRoute는 admin 유저만 들어가게1 할 것인지를 정하는 것

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log(response);

        if (!response.payload.isAuth) {
          //로그인 하지 않은 상태
          if (option) {
            props.history.push("/");
          }
        } else {
          //로그인 한 상태
          // admin이 아닌데 admin만 들어갈 수 있는(adminRoute=true) 페이지를 들어가려할 때
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
          } else {
            if (option === false) {
              props.history.push("/");
            }
          }
        }
      });
    }, [dispatch, props.history]);
    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
