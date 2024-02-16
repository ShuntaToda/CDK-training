import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Resource } from "./abstract/resource";

interface ResourceInfo {
  readonly id: string;
  readonly cidrBlock: string;
  readonly availabilityZone: string;
  readonly resourceName: string;
  readonly assign: (subnet: ec2.CfnSubnet) => void;
}

export class Subnet extends Resource {
  public public1a: ec2.CfnSubnet;
  public public1c: ec2.CfnSubnet;
  public private1a: ec2.CfnSubnet;
  public private1c: ec2.CfnSubnet;

  private readonly vpc: ec2.CfnVPC;
  private readonly resourceInfo: ResourceInfo[] = [
    {
      id: "subnetPublic1a",
      cidrBlock: "10.0.11.0/24",
      availabilityZone: "ap-northeast-1a",
      resourceName: "subnet-public-1a",
      assign: (subnet) => (this.public1a = subnet),
    },

    {
      id: "subnetPublic1c",
      cidrBlock: "10.0.12.0/24",
      availabilityZone: "ap-northeast-1c",
      resourceName: "subnet-public-1c",
      assign: (subnet) => (this.public1c = subnet),
    },

    {
      id: "subnetPrivate1a",
      cidrBlock: "10.0.21.0/24",
      availabilityZone: "ap-northeast-1a",
      resourceName: "subnet-private-1a",
      assign: (subnet) => (this.private1a = subnet),
    },
    {
      id: "subnetPrivate1c",
      cidrBlock: "10.0.22.0/24",
      availabilityZone: "ap-northeast-1c",
      resourceName: "subnet-private-1c",
      assign: (subnet) => (this.private1c = subnet),
    },
  ];
  constructor(vpc: ec2.CfnVPC) {
    super();
    this.vpc = vpc;
  }

  public createResources(scope: Construct) {
    for (const resourceInfo of this.resourceInfo) {
      const subnet = this.createSubnet(scope, resourceInfo);
      resourceInfo.assign(subnet);
    }
  }

  private createSubnet(scope: Construct, resourceInfo: ResourceInfo): ec2.CfnSubnet {
    const subnet = new ec2.CfnSubnet(scope, resourceInfo.id, {
      cidrBlock: resourceInfo.cidrBlock,
      vpcId: this.vpc.ref,
      availabilityZone: resourceInfo.availabilityZone,
      tags: [{ key: "Name", value: this.createResourceName(scope, resourceInfo.resourceName) }],
    });
    return subnet;
  }
}
