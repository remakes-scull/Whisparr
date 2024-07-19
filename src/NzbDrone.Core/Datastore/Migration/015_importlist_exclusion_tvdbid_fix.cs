using FluentMigrator;
using NzbDrone.Core.Datastore.Migration.Framework;

namespace NzbDrone.Core.Datastore.Migration
{
    [Migration(015)]
    public class FixImportListExclusionTvdbIdColumnType : NzbDroneMigrationBase
    {
        protected override void MainDbUpgrade()
        {
            // ALTER TABLE public."ImportListExclusions" ALTER COLUMN "TvdbId"  TYPE integer USING ("TvdbId"::integer);
            Alter.Table("ImportListExclusions").AlterColumn("TvdbId").AsInt32().NotNullable().Unique();
        }
    }
}
