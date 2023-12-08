import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { BellIcon, ShieldCheck } from "lucide-react";
import React from "react";
import Balancer from "react-wrap-balancer";
import { Scrollbar } from "./scroll-bar";
import { TruncateContent } from "~/app/vendor/truncate-content";
import { RequestInfoModal } from "./request-info-modal";
import { RequestActions } from "~/app/vendor/request-actions";
import { Request } from "~/types/structs";

type Props = {
  searchParams: {};
  params: {};
};

export default function Page(props: Props) {
  const requests: Request[] = [
    {
      id: "11",
      user: { username: "Johnson Walker", verified: true },
      category: "Electronics",
      description:
        "I'm looking for a micro blender blender to help with my tea. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum nobis quasi sit tempore voluptatum. At atque cumque dolor dolore earum eligendi, ipsa, iusto libero molestiae nam natus, quae ullam veritatis.",
      images: ["https://some-image.com"],
    },
    {
      id: "1011",
      user: { username: "Peter Pedigree", verified: false },
      category: "Electronics",
      description:
        "A TYMO hair dryer for really soft here. Something between 15k - 20k",
      images: ["https://some-image.com"],
    },
    {
      id: "1011",
      user: { username: "Matthew Peters", verified: false },
      category: "Electronics",
      description:
        "My Keycloak is really bad. Don't know where to get this type",
      images: ["https://some-image.com"],
    },
  ];

  return (
    <div className={"px-4 flex flex-col flex-1 items-start justify-center"}>
      <Card
        className={
          "flex flex-col rounded-2xl md:h-[80vh] max-w-[592px] md:aspect-[3/4]"
        }
      >
        <CardHeader className={"flex-shrink-0 p-4"}>
          <CardTitle>All Requests</CardTitle>
          <p className={"text-muted-foreground text-xs"}>
            All customer requests will be shown here.
          </p>
        </CardHeader>

        <CardContent className={"flex-1 border-t p-0"}>
          <Scrollbar>
            <section className={"px-6 pt-0"}>
              {requests.length === 0 ? (
                <div className={"py-12"}>
                  <EmptyState />
                </div>
              ) : null}

              <div className={"flex flex-col space-y-4 mt-6"}>
                {requests.map((request) => (
                  <IssueItem key={request.id} data={request} />
                ))}
              </div>
            </section>
          </Scrollbar>
        </CardContent>
      </Card>
    </div>
  );
}

const IssueItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"a"> & { data: Request }
>(function RequestItem(props) {
  const { children, className, data, ...PROPS } = props;

  return (
    <RequestInfoModal data={data}>
      <a
        href={"#"}
        {...PROPS}
        className={cn(
          "flex hover:bg-gray-50 text-left rounded-2xl px-2 -mx-2 py-2 gap-x-4",
          className,
        )}
      >
        <figure
          className={
            "w-1/3 aspect-square rounded-lg bg-gray-200 flex-shrink-0 border"
          }
        ></figure>

        <section className={"flex flex-col flex-1 space-y-2"}>
          <div className={"flex flex-col pt-2 space-y-1 text-muted-foreground"}>
            <p className={"text-sm items-center space-x-2 flex"}>
              <span className={"inline-flex"}>
                {(data?.user?.username ?? "").split("@").map((e) => {
                  return e === "" ? (
                    <span className={"text-muted-foreground"}>@</span>
                  ) : (
                    <span className={"font-medium"}>{e}</span>
                  );
                })}
              </span>

              {data?.user?.verified ? (
                <ShieldCheck color={"limegreen"} size={"1em"}>
                  Verified
                </ShieldCheck>
              ) : null}
            </p>
          </div>

          <div className={"flex-1"}>
            <TruncateContent
              className={"text-sm text-foreground"}
              maxNumOfLines={3}
            >
              {data?.description}
            </TruncateContent>
          </div>

          <RequestActions />
        </section>
      </a>
    </RequestInfoModal>
  );
});

function EmptyState() {
  return (
    <div
      className={
        "flex items-center flex-col self-center text-center py-12 justify-center rounded-lg "
      }
    >
      <BellIcon className={"text-secondary"} />
      <h4 className={"text-semibold font-display text-lg mt-4 mb-2"}>
        No new issue
      </h4>
      <p className={"text-sm text-muted-foreground max-w-[200px]"}>
        <Balancer>New issue should appear here when available</Balancer>
      </p>
    </div>
  );
}
