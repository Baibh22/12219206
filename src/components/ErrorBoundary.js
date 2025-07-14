import { Log } from '../utils/logger';

export class ErrorBoundary extends React.Component {
  state = { error: null };

  componentDidCatch(error, info) {
    Log('frontend', 'fatal', 'api', 'Application error occurred', {
      error: error.toString(),
      componentStack: info.componentStack
    });
    this.setState({ error });
  }

  render() {
    if (this.state.error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          <Typography variant="h6">Something went wrong</Typography>
          <Typography variant="body2">
            {this.state.error.toString()}
          </Typography>
        </Alert>
      );
    }
    return this.props.children;
  }
}