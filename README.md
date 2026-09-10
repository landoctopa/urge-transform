## Server Console Error

```bash
-----
FATAL: An unexpected Turbopack error occurred. A panic log has been written to /tmp/next-panic-bd94a3ec5887ae4b957d633b54a3975a.log.

To help make Turbopack better, report this error by clicking here.
-----

[Server HMR] Subscription error, resubscribing: Error [TurbopackInternalError]: Cell CellId { type_id: ValueTypeId { id: 550, name: ValueType { name: "turbopack_ecmascript::hmr::version::EcmascriptMergedChunkVersion" } }, index: 0 } no longer exists in task TaskId { id: 185065 } <EcmascriptBuildNodeChunkListContent as VersionedContent>::update (no cell of this type exists)

Debug info:
- Execution of all_hmr_update_with_issues_operation failed
- Execution of Project::all_hmr_update failed
- Execution of <EcmascriptBuildNodeChunkListContent as VersionedContent>::update failed
- Execution of <EcmascriptMergedChunkContent as VersionedContent>::update failed
- Cell CellId { type_id: ValueTypeId { id: 550, name: ValueType { name: "turbopack_ecmascript::hmr::version::EcmascriptMergedChunkVersion" } }, index: 0 } no longer exists in task TaskId { id: 185065 } <EcmascriptBuildNodeChunkListContent as VersionedContent>::update (no cell of this type exists)
    at <unknown> (TurbopackInternalError: Cell CellId { type_id: ValueTypeId { id: 550, name: ValueType { name: "turbopack_ecmascript::hmr::version::EcmascriptMergedChunkVersion" } }, index: 0 } no longer exists in task TaskId { id: 185065 } <EcmascriptBuildNodeChunkListContent as VersionedContent>::update (no cell of this type exists)) {
  location: undefined
}

```