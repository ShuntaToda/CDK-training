import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Resource } from "./abstract/resource";

export class InternetGateway extends Resource {
  public igw: ec2.CfnInternetGateway;
  private readonly vpc: ec2.CfnVPC;

  constructor(vpc: ec2.CfnVPC) {
    super();
    this.vpc = vpc;
  }

  createResources(scope: Construct): void {
    this.igw = new ec2.CfnInternetGateway(scope, "InternetGateway", {
      tags: [{ key: "Name", value: this.createResourceName(scope, "igw") }],
    });

    new ec2.CfnVPCGatewayAttachment(scope, "VpcGatewayAttachment", {
      vpcId: this.vpc.ref,
      internetGatewayId: this.igw.ref,
    });
  }
}
