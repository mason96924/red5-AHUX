"""
elc.dxf_deps_bundle — lazy extract for heavy DXF vendor deps.

The main deploy bundle stays small (SCU link, SSE, floors API).  DXF import
needs ezdxf + Pillow + numpy (~20 MB compressed) which is shipped separately
as ``pgpy/dxf_vendor.zip`` and extracted on first use or after upload.
"""
from __future__ import annotations

import os
import zipfile

_MARKER = os.path.join('ezdxf', '__init__.py')
_ZIP_NAME = 'dxf_vendor.zip'


def dxf_vendor_ready(plugins_root: str) -> bool:
    return bool(plugins_root) and os.path.isfile(
        os.path.join(plugins_root, _MARKER),
    )


def extract_dxf_vendor(plugins_root: str) -> bool:
    """Extract ``dxf_vendor.zip`` into ``<plugins_root>/``.

    Returns True when ``ezdxf/__init__.py`` exists after this call.
    """
    if not plugins_root:
        return False
    if dxf_vendor_ready(plugins_root):
        return True
    zippath = os.path.join(plugins_root, _ZIP_NAME)
    if not os.path.isfile(zippath):
        return False
    with zipfile.ZipFile(zippath) as zf:
        zf.extractall(plugins_root)
    return dxf_vendor_ready(plugins_root)
