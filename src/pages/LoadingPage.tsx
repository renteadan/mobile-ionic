

import * as React from 'react';

interface LoginPageProps {}

interface LoginPageState {}

class Loading extends React.Component<LoginPageProps, LoginPageState> {
  render() {
    return (
      <div>
        <h1>
          Loading...
        </h1>
      </div>
    );
  }
}

export default Loading;
