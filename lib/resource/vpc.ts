import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Resource } from "./abstract/resource";

export class Vpc extends Resource {
  public vpc: ec2.CfnVPC;

  constructor() {
    super();
  }
  public createResources(scope: Construct) {
    this.vpc = new ec2.CfnVPC(scope, "Vpc", {
      cidrBlock: "10.0.0.0/16",
      tags: [{ key: "Name", value: this.createResourceName(scope, "vpc") }],
    });
  }
}
