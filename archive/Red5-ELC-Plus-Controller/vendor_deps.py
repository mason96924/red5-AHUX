"""vendor_deps.py — ensure offline controller deps live under pgpy/."""
from __future__ import annotations

import os
import subprocess
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
PGPY = os.path.join(HERE, 'pgpy')
ZONEINFO_SRC = os.path.join(PGPY, 'tzdata', 'zoneinfo')
ZONEINFO_ZIP = os.path.join(PGPY, 'tzdata_zoneinfo.zip')
DXF_VENDOR_ZIP = os.path.join(PGPY, 'dxf_vendor.zip')

# Pure-Python, no extra deps.  Bundled for Delta controllers without pip.
VENDORED = (
    ('astral', '3.2'),
    ('tzdata', '2025.2'),
)

# DXF import stack (ezdxf + drawing addon).  Packed into pgpy/dxf_vendor.zip
# for a separate sidecar upload — not inlined in the main deploy bundle.
DXF_DEPS = (
    ('ezdxf', '1.3.5'),
    ('Pillow', '10.4.0'),
    ('numpy', '2.2.6'),
    ('typing_extensions', '4.12.2'),
    ('pyparsing', '3.1.2'),
    ('fonttools', '4.53.1'),
)

DXF_VENDOR_TOP = (
    'ezdxf', 'PIL', 'numpy', 'numpy.libs', 'pillow.libs', 'fontTools', 'pyparsing',
    'typing_extensions.py', '.dxf_vendor_platform',
)
DXF_VENDOR_DIST_PREFIXES = (
    'pillow-', 'numpy-', 'ezdxf-', 'fonttools-', 'pyparsing-',
    'typing_extensions-',
)

# Delta controllers are Linux aarch64 (override via RED5_CONTROLLER_PLATFORM).
CONTROLLER_PLATFORM = os.environ.get(
    'RED5_CONTROLLER_PLATFORM', 'manylinux2014_aarch64',
)
CONTROLLER_PY = os.environ.get('RED5_CONTROLLER_PY', '312')
DXF_BINARY_PACKAGES = frozenset({'ezdxf', 'Pillow', 'numpy'})

_SKIP_IN_DXF_ZIP = ('__pycache__', '.pyc', '/tests/', '/test_', '/testing/')


def _skip_dxf_zip_path(rel: str) -> bool:
    low = rel.replace('\\', '/')
    return any(pat in low for pat in _SKIP_IN_DXF_ZIP)


def pack_zoneinfo_zip() -> None:
    """Pack IANA zone files into one .zip (allowed bundle extension on Delta)."""
    if not os.path.isdir(ZONEINFO_SRC):
        print('[vendor_deps] skip zoneinfo zip — no tzdata/zoneinfo/')
        return
    tmp = ZONEINFO_ZIP + '.tmp'
    if os.path.exists(tmp):
        os.unlink(tmp)
    count = 0
    with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for root, _dirs, files in os.walk(ZONEINFO_SRC):
            for fn in files:
                full = os.path.join(root, fn)
                arc = os.path.relpath(full, os.path.join(PGPY, 'tzdata'))
                zf.write(full, arcname=arc.replace(os.sep, '/'))
                count += 1
    os.replace(tmp, ZONEINFO_ZIP)
    print(f'[vendor_deps] packed {count} zone files -> pgpy/tzdata_zoneinfo.zip')


def pack_dxf_vendor_zip() -> None:
    """Pack vendored DXF deps into pgpy/dxf_vendor.zip (sidecar upload)."""
    marker = os.path.join(PGPY, 'ezdxf', '__init__.py')
    if not os.path.isfile(marker):
        print('[vendor_deps] skip dxf_vendor zip — ezdxf not installed')
        return
    tmp = DXF_VENDOR_ZIP + '.tmp'
    if os.path.exists(tmp):
        os.unlink(tmp)
    count = 0
    with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for name in os.listdir(PGPY):
            include = (
                name in DXF_VENDOR_TOP
                or any(name.startswith(p) for p in DXF_VENDOR_DIST_PREFIXES)
            )
            if not include:
                continue
            full = os.path.join(PGPY, name)
            if os.path.isfile(full):
                if _skip_dxf_zip_path(name):
                    continue
                zf.write(full, arcname=name)
                count += 1
                continue
            if not os.path.isdir(full):
                continue
            for root, dirs, files in os.walk(full):
                dirs[:] = [d for d in dirs if d not in ('__pycache__', '.git')]
                for fn in files:
                    ffull = os.path.join(root, fn)
                    arc = os.path.relpath(ffull, PGPY).replace(os.sep, '/')
                    if _skip_dxf_zip_path(arc):
                        continue
                    zf.write(ffull, arcname=arc)
                    count += 1
    os.replace(tmp, DXF_VENDOR_ZIP)
    size_mb = os.path.getsize(DXF_VENDOR_ZIP) / (1024 * 1024)
    print(f'[vendor_deps] packed {count} DXF vendor files -> pgpy/dxf_vendor.zip ({size_mb:.1f} MB)')


def install_dxf_deps() -> None:
    marker = os.path.join(PGPY, 'ezdxf', '__init__.py')
    plat_marker = os.path.join(PGPY, '.dxf_vendor_platform')
    want_plat = f'{CONTROLLER_PLATFORM}-py{CONTROLLER_PY}-numpy'
    if os.path.isfile(marker):
        try:
            if open(plat_marker, encoding='utf-8').read().strip() == want_plat:
                print('[vendor_deps] ezdxf already present for', want_plat)
                pack_dxf_vendor_zip()
                return
        except OSError:
            pass
        print('[vendor_deps] re-vendoring DXF deps for', want_plat)
        for name in ('ezdxf', 'PIL', 'numpy', 'numpy.libs', 'pillow.libs',
                      'pillow-10.4.0.dist-info', 'numpy-2.2.6.dist-info',
                      'ezdxf-1.3.5.dist-info', 'pyparsing', 'fontTools',
                      'fonttools-4.53.1.dist-info', 'typing_extensions.py',
                      'typing_extensions-4.12.2.dist-info',
                      'pyparsing-3.1.2.dist-info'):
            path = os.path.join(PGPY, name)
            if os.path.isdir(path):
                import shutil
                shutil.rmtree(path, ignore_errors=True)
            elif os.path.isfile(path):
                os.unlink(path)
    for package, version in DXF_DEPS:
        spec = f'{package}=={version}'
        cmd = [
            sys.executable, '-m', 'pip', 'install',
            '--target', PGPY, spec, '--no-deps', '--upgrade',
        ]
        if package in DXF_BINARY_PACKAGES:
            cmd.extend([
                '--platform', CONTROLLER_PLATFORM,
                '--python-version', CONTROLLER_PY,
                '--only-binary=:all:',
            ])
        print(f'[vendor_deps] installing {spec} -> pgpy/ (dxf, {want_plat})')
        subprocess.check_call(cmd)
    with open(plat_marker, 'w', encoding='utf-8') as fh:
        fh.write(want_plat)
    pack_dxf_vendor_zip()


def main() -> None:
    os.makedirs(PGPY, exist_ok=True)
    for package, version in VENDORED:
        marker = os.path.join(PGPY, package, '__init__.py')
        if os.path.isfile(marker):
            print(f'[vendor_deps] {package} already present')
            continue
        spec = f'{package}=={version}'
        print(f'[vendor_deps] installing {spec} -> pgpy/')
        subprocess.check_call([
            sys.executable, '-m', 'pip', 'install',
            '--target', PGPY, spec, '--no-deps', '--upgrade',
        ])
    install_dxf_deps()
    pack_zoneinfo_zip()


if __name__ == '__main__':
    main()
