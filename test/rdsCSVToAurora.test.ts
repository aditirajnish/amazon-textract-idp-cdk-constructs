import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { CSVToAuroraTask } from '../src';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

describe('ClassificationTest', () => {
  test('ClassificationTest', () => {
    new CSVToAuroraTask(stack, 'csvtoAurora', {
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
      vpc: new ec2.Vpc(stack, 'someid', {
        cidr: '10.0.0.0/16',
        maxAzs: 2,
        subnetConfiguration: [{
          cidrMask: 26,
          name: 'isolatedSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
        }, {
          cidrMask: 26,
          name: 'privateWithNat',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        }, {
          cidrMask: 26,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE,
        }],
        natGateways: 1,
      }),
    });
    expect(Template.fromStack(stack).toJSON()).toMatchSnapshot();
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::Lambda::Function', 3);
  });
});
