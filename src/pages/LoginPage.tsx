import * as React from 'react';
import Login from '../components/Login';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import Service from '../service/service';

interface LoginPageProps extends RouteComponentProps {}

interface LoginPageState {
  password: string;
  email: string;
  isError: boolean;
  errorMessage: string;
  redirect: string;
}

class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
  service: Service;
  constructor(props: LoginPageProps) {
    super(props);
    this.state = {
      password: '',
      email: '',
      isError: false,
      errorMessage: 'Parola nu este corecta.',
      redirect: ''
    };
    this.service = new Service();
  }

  async componentDidMount() {
    const auth = await this.service.verify();
    if(auth) {
      this.setState({
        redirect: '/tab'
      })
    }
  }

  handleChange = (data: any) => {
    this.setState({
      ...data,
      isError: false,
    });
  };
  clearUserData() {
    this.setState({
      password: '',
      isError: true,
    });
  }

  submit = async () => {
    try {
      const data = await this.service.login(this.state);
      const token = data.token;
      localStorage.setItem('myToken', token);
      this.setState({
        redirect: '/tab'
      });
    } catch (error) {
      console.log(error);
      this.setState({
        isError: true,
      });
      this.clearUserData();
    }
  };

  render() {
    const {redirect} = this.state;
    if(redirect) {
      return <Redirect to={redirect} />;
    }
    return (
      <div>
        <Login
          {...this.state}
          handleChange={this.handleChange}
          submit={this.submit}
        ></Login>

      </div>
    );
  }
}

export default withRouter(LoginPage);
