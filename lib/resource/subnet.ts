import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Resource } from "./abstract/resource";

export class Subnet extends Resource {
  public public1a: ec2.CfnSubnet;
  public public1c: ec2.CfnSubnet;
  public private1a: ec2.CfnSubnet;
  public private1c: ec2.CfnSubnet;

  private readonly vpc: ec2.CfnVPC;
  constructor(vpc: ec2.CfnVPC) {
    super();
    this.vpc = vpc;
  }

  public createResources(scope: Construct) {
    const systemName = scope.node.tryGetContext("systemName");
    const envType = scope.node.tryGetContext("envType");

    this.public1a = new ec2.CfnSubnet(scope, "subnetPublic1a", {
      cidrBlock: "10.0.11.0/24",
      vpcId: this.vpc.ref,
      availabilityZone: "ap-northeast-1a",
      tags: [{ key: "Name", value: this.createResourceName(scope, "subnet-public-1a") }],
    });

    this.public1c = new ec2.CfnSubnet(scope, "subnetPublic1c", {
      cidrBlock: "10.0.12.0/24",
      vpcId: this.vpc.ref,
      availabilityZone: "ap-northeast-1c",
      tags: [{ key: "Name", value: this.createResourceName(scope, "subnet-public-1c") }],
    });

    this.private1a = new ec2.CfnSubnet(scope, "subnetPrivate1a", {
      cidrBlock: "10.0.21.0/24",
      vpcId: this.vpc.ref,
      availabilityZone: "ap-northeast-1a",
      tags: [{ key: "Name", value: this.createResourceName(scope, "subnet-private-1a") }],
    });
    this.private1c = new ec2.CfnSubnet(scope, "subnetPrivate1c", {
      cidrBlock: "10.0.22.0/24",
      vpcId: this.vpc.ref,
      availabilityZone: "ap-northeast-1c",
      tags: [{ key: "Name", value: this.createResourceName(scope, "subnet-private-1c") }],
    });
  }
}
