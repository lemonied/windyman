import React, { Component, ReactNode, createRef } from 'react';
import ReactDOM from 'react-dom';
import './style.scss';
import { CSSTransition } from 'react-transition-group';
import { YField, YForm } from '../y-form';
import { Input } from '../input';
import { FormInstance } from 'rc-field-form';
import { Rule } from 'rc-field-form/es/interface';

interface Footer {
  text: string;
  callback?: (val?: any) => void;
}
interface Props {
  header?: ReactNode;
  content?: ReactNode;
  footer?: Footer[];
  maskClick?: (e: any) => void;
}
const defaultProps: Props = {
  header: '提示',
  footer: []
};

export class Modal extends Component<Props, any> {
  static defaultProps: Props = defaultProps;
  readonly state = {
    show: false
  };

  preventClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }
  show() {
    this.setState({ show: true });
  }
  hide() {
    this.setState({ show: false });
  }

  render() {
    const { header, content, footer, maskClick } = this.props;
    const { show } = this.state;
    return (
      <CSSTransition
        in={show}
        classNames={{
          enter: 'modal-enter',
          enterActive: 'modal-enter-active',
          exit: 'modal-exit',
          exitActive: 'modal-exit-active',
          exitDone: 'modal-exit-done'
        }}
        timeout={300}
      >
        <div className={'windy-modal-wrapper'} onClick={maskClick}>
          <div className={'modal'} onClick={this.preventClick.bind(this)}>
            <div className={'modal-header'}>{ header }</div>
            <div className={'modal-content'}>{ content }</div>
            <div className={'modal-footer'}>
              {
                footer?.map((item, key) =>(
                  <button key={key} className={'button'} onClick={item.callback}>{item.text}</button>
                ))
              }
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  }
}

interface PromptInputProps {
  rules?: Rule[];
  placeholder?: string;
  initialValue?: any;
}
class PromptInput extends Component<PromptInputProps, any> {
  ref = createRef<FormInstance>();

  componentDidMount() {}

  render() {
    const { rules, placeholder, initialValue } = this.props;

    return (
      <YForm ref={this.ref} className={'windy-modal-form'}>
        <YField
          name={'prompt'}
          rules={rules}
          initialValue={initialValue}
        >
          <Input className={'windy-modal-input'} type={'text'} placeholder={placeholder} />
        </YField>
      </YForm>
    );
  }
}

interface ModalServiceOptions {
  title: string;
  content: ReactNode;
  footer: Footer[];
}
interface ConfirmOptions {
  title?: string;
  cancelText?: string;
  content?: ReactNode;
  confirmText?: string;
}
interface PromptOptions {
  title?: string;
  cancelText?: string;
  confirmText?: string;
  placeholder?: string;
  rules?: Rule[];
  initialValue?: any;
}
export class ModalService {
  ele: Element[] = [];

  create(
    options: ModalServiceOptions,
    callback?: (result?: any) => void
  ): { close(): void; } {
    const { title, content, footer } = options;
    const container = document.createElement('div');
    container.className = 'modal-container';
    document.body.appendChild(container);
    const instance = createRef<Modal>();
    ReactDOM.render(
      <Modal
        ref={ instance }
        header={ title }
        content={ content }
        maskClick={ callback }
        footer={ footer }
      />,
      container
    );
    this.ele.push(container);
    instance.current?.show();
    return {
      close: () => {
        instance.current?.hide();
        setTimeout(() => this.destroy(container), 300);
      }
    };
  }
  confirm(
    options: ConfirmOptions
  ): Promise<boolean> {
    const { title = '提示', content, cancelText = '取消', confirmText = '确定' } = options;
    return new Promise((resolve, reject) => {
      const works = this.create({
        title,
        content,
        footer: (
          [{
            text: cancelText,
            callback: () => {
              works.close();
              resolve();
            }
          }, {
            text: confirmText,
            callback: () => {
              works.close();
              resolve(true);
            }
          }]
        )
      });
    });
  }
  prompt(
    options: PromptOptions
  ): Promise<boolean> {
    const { title = '提示', cancelText = '取消', confirmText = '确定', placeholder, rules, initialValue } = options;
    const prompt = createRef<PromptInput>();
    return new Promise((resolve, reject) => {
      const works = this.create({
        title,
        content: <PromptInput ref={prompt} placeholder={placeholder} rules={rules} initialValue={initialValue} />,
        footer: (
          [{
            text: cancelText,
            callback: () => {
              works.close();
              resolve();
            }
          }, {
            text: confirmText,
            callback: () => {
              if (prompt.current) {
                prompt.current.ref.current?.validateFields().then(val => {
                  works.close();
                  resolve(val.prompt);
                });
              }
            }
          }]
        )
      });
    });
  }
  alert(content: ReactNode, confirmText = '好的'): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const works = this.create({
        title: '提示',
        content,
        footer: [{
          text: confirmText,
          callback: () => {
            works.close();
            resolve(true);
          }
        }]
      });
    });
  }

  destroy(ele: Element) {
    ReactDOM.unmountComponentAtNode(ele);
    ele.remove();
    const index = this.ele.indexOf(ele);
    if (index > -1) {
      this.ele.splice(index, 1);
    }
  }
  destroyAll() {
    this.ele.forEach(el => {
      ReactDOM.unmountComponentAtNode(el);
      el.remove();
    });
  }
}

export const modal = new ModalService();
