import { Cover } from "@/components/cover";
import GoogleTagManager from "@/components/google_tag_manager";
import {
  LocationEntity,
  LocationEntityResponseCollection,
  ProfileEntity,
  ProfileEntityResponseCollection,
  ServiceEntity, ServiceEntityResponseCollection,
  UserEventEntity,
  UserEventEntityResponseCollection
} from "@/lib/graphql";
import request, { gql } from "graphql-request";
import parse from 'html-react-parser';

/**
 * サイトタイトルとサイト説明を定義する。
 */
export async function generateMetadata({ params }: { params: any }) {
  return {
    title: "Profile - サイバーエッジ株式会社",
    description: "サイバーエッジ株式会社は、最先端のITシステムやソリューションに関する技術支援、コンサルティングやシステム開発等、信頼と品質を重視したサービスで、あなたのビジネスを次のレベルへ導きます。",
  }
};

let gql_res: any;

export default async function Profile() {
  const query = gql`
    {
      profiles(filters: {Visible: {eq: true}}, sort: "Order:asc") {
        data {
          id
          attributes {
            Title
            Description
          }
        }
      }
      locations(filters: {Visible: {eq: true}}, sort: "Order:asc") {
        data {
          id
          attributes {
            Title
            HTML
          }
        }
      }
    }
  `;

  try {
    gql_res = await request(
      process.env.GRAPHQL_ENDPOINT_URL || '',
      query
    );
    // console.log(gql_res.profiles.data);
    // console.log(gql_res.locations.data);
  }
  catch (e) {
    console.log(e);
  }

  function create_profile_element(entity: ProfileEntity) {
    return (
      <tr className="" key={entity.id}>
        <td className="p-4">{entity.attributes?.Title}</td>
        <td className="p-4">{entity.attributes?.Description}</td>
      </tr>
    );
  }

  function create_location_element(entity: LocationEntity) {
    return (
      <div className="my-8" key={entity.id}>
        <div className="py-2">【{entity.attributes?.Title}】</div>
        <div>{parse(entity.attributes?.HTML || '')}</div>
      </div>
    );
  }

  return (
    <>
      <GoogleTagManager />
      <div>
        <Cover pathname='/profile' />
        <div className="container mx-auto px-6 md:px-20">
          <div className="my-10">
            <table className="table-auto w-full">
              <tbody className="divide-y">
                {gql_res.profiles.data.map((entity: ProfileEntity) => {
                  return create_profile_element(entity);
                })}
              </tbody>
            </table>
            {gql_res.locations.data.map((entity: LocationEntity) => {
              return create_location_element(entity);
            })}
          </div>
        </div>
      </div>
    </>
  );
}
