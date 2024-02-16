import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Resource } from "./abstract/resource";

interface RouteInfo {
  readonly id: string;
  readonly destinationCidrBlock: string;
  readonly gatewayId?: () => string;
  readonly natGatewayId?: () => string;
}
interface AssociationInfo {
  readonly id: string;
  readonly subnetId: () => string;
}

interface ResourceInfo {
  readonly id: string;
  readonly resourceName: string;
  readonly routes: RouteInfo[];
  readonly associations: AssociationInfo[];
  readonly assign: (routeTable: ec2.CfnRouteTable) => void;
}

export class RouteTable extends Resource {
  public public: ec2.CfnRouteTable;
  public private: ec2.CfnRouteTable;

  private readonly vpc: ec2.CfnVPC;
  private readonly subnetPublic1a: ec2.CfnSubnet;
  private readonly subnetPublic1c: ec2.CfnSubnet;
  private readonly subnetPrivate1a: ec2.CfnSubnet;
  private readonly subnetPrivate1c: ec2.CfnSubnet;

  private readonly internetGateway: ec2.CfnInternetGateway;

  private readonly resources: ResourceInfo[] = [
    {
      id: "RouteTablePublic",
      resourceName: "rtb-public",
      routes: [
        {
          id: "RoutePublic",
          destinationCidrBlock: "0.0.0.0/0",
          gatewayId: () => this.internetGateway.ref,
        },
      ],
      associations: [
        {
          id: "AssociationPublic1a",
          subnetId: () => this.subnetPublic1a.ref,
        },
        {
          id: "AssociationPublic1c",
          subnetId: () => this.subnetPublic1c.ref,
        },
      ],
      assign: (routeTable) => (this.public = routeTable),
    },
    {
      id: "RouteTablePrivate",
      resourceName: "rtb-private",
      routes: [
        {
          id: "RoutePrivate",
          destinationCidrBlock: "0.0.0.0/0",
        },
      ],
      associations: [
        {
          id: "AssociationPrivate1a",
          subnetId: () => this.subnetPrivate1a.ref,
        },
        {
          id: "AssociationPrivate1c",
          subnetId: () => this.subnetPrivate1c.ref,
        },
      ],
      assign: (routeTable) => (this.private = routeTable),
    },
  ];

  constructor(
    vpc: ec2.CfnVPC,
    subnetPublic1a: ec2.CfnSubnet,
    subnetPublic1c: ec2.CfnSubnet,
    subnetPrivate1a: ec2.CfnSubnet,
    subnetPrivate1c: ec2.CfnSubnet,
    internetGateway: ec2.CfnInternetGateway
  ) {
    super();
    this.vpc = vpc;
    this.subnetPublic1a = subnetPublic1a;
    this.subnetPublic1c = subnetPublic1c;
    this.subnetPrivate1a = subnetPrivate1a;
    this.subnetPrivate1c = subnetPrivate1c;
    this.internetGateway = internetGateway;
  }

  createResources(scope: Construct): void {
    for (const resourceInfo of this.resources) {
      const routeTable = this.createRouteTable(scope, resourceInfo);
      resourceInfo.assign(routeTable);
    }
  }

  private createRouteTable(scope: Construct, resourceInfo: ResourceInfo): ec2.CfnRouteTable {
    const routeTable = new ec2.CfnRouteTable(scope, resourceInfo.id, {
      vpcId: this.vpc.ref,
      tags: [
        {
          key: "Name",
          value: this.createResourceName(scope, resourceInfo.resourceName),
        },
      ],
    });

    for (const routeInfo of resourceInfo.routes) {
      this.createRoute(scope, routeInfo, routeTable);
    }

    for (const associationInfo of resourceInfo.associations) {
      this.createAssociation(scope, associationInfo, routeTable);
    }

    return routeTable;
  }

  private createRoute(scope: Construct, routeInfo: RouteInfo, routeTable: ec2.CfnRouteTable) {
    const route = new ec2.CfnRoute(scope, routeInfo.id, {
      routeTableId: routeTable.ref,
      destinationCidrBlock: routeInfo.destinationCidrBlock,
    });
    if (routeInfo.gatewayId) {
      route.gatewayId = routeInfo.gatewayId();
    } else if (routeInfo.natGatewayId) {
      route.natGatewayId = routeInfo.natGatewayId();
    }
  }
  private createAssociation(scope: Construct, associationInfo: AssociationInfo, routeTable: ec2.CfnRouteTable) {
    new ec2.CfnSubnetRouteTableAssociation(scope, associationInfo.id, {
      routeTableId: routeTable.ref,
      subnetId: associationInfo.subnetId(),
    });
  }
}
