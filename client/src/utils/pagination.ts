const convertPage = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
};
export { convertPage };
