#! /usr/bin/python3
# -*- coding: utf-8 -*-

########################################################################
#  Copyright (C) 2021  alexpdev
#
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU Lesser General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU Lesser General Public License for more details.
#
#  You should have received a copy of the GNU Lesser General Public License
#  along with this program.  If not, see <https://www.gnu.org/licenses/>.
#########################################################################
"""
Module contains implementation specific to amazon formatted ebooks.

Classes and functions for .azw, .azw3, and .kfx ebooks.
"""

import re
import struct
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
from .standards import _OPF_PARENT_TAGS
from .standards import EXTH_Types


class Kindle:
    """Gather Epub Metadata."""

    def __init__(self, path):
        """
        Construct the EpubMeta Class Instance.

        Args:
            path (str or pathlike): path to ebook file.
        """
        self.path = Path(path)
        self.name = self.path.name
        self.stem = self.path.stem
        self.suffix = self.path.suffix
        self.data = self.path.read_bytes()
        self.palmheader = self.data[:78]
        self.palmname = self.data[:32]
        self.metadata = []
        self.find_metadata()

    def unShort(self, x):
        """
        Convert bits to text.

        Args:
            x (bytes): bytes to decode

        Returns:
            str: decoded bytes
        """
        buffer = self.data
        val = struct.unpack_from(">H", buffer, x)
        return val

    def unLongx(self, total, x):
        """
        Convert bits to text.

        Args:
            total (int): number of bytes to decode
            x (bytes): bytes to decode

        Returns:
            str: decoded bytes
        """
        buffer = self.data
        form = ">" + ("L" * total)
        val = struct.unpack_from(form, buffer, x)
        return val

    def find_metadata(self):
        """Find the offset to the EXTH header."""
        offset = self.data.find(b"EXTH")
        if offset < 0:
            raise HeaderMissingError(self.path)
        _, _, recCount = self.unLongx(3, offset)
        offset += 12
        for _ in range(recCount):
            id, size = self.unLongx(2, offset)
            content = self.data[offset + 8: offset + size]
            record = (id, content)
            self.metadata.append(record)
            offset += size
        if len(self.metadata) < 1:
            raise MetadataError(self.path)

    def get_metadata(self):
        """
        Extract metadata from ebook.

        Returns:
            dict: key, value pairs of metadata.
        """
        meta = {}
        self.metadata += path_meta(self.path)
        for k, v in self.metadata:
            if hasattr(v, "decode"):
                v = v.decode(errors="replace")
            if k in EXTH_Types:
                type_ = EXTH_Types[k]
                if type_ not in meta:
                    meta[type_] = [v]
                else:
                    meta[type_].append(v)
            else:
                if str(k) not in meta:
                    meta[str(k)] = [v]
                else:
                    meta[str(k)].append(v)
        return meta


class Epub:
    """Gather Epub Metadata."""

    def __init__(self, path):
        """
        Construct the EpubMeta Class Instance.

        Args:
            path (str or pathlike): path to ebook file.
        """
        self.tags = [
            "dc:title",
            "dc:contributor",
            "dc:creator",
            "dc:identifier",
            "dc:language",
            "dc:publisher",
            "dc:date",
            "dc:description",
            "dc:subject",
            "dc:rights",
            "creator",
            "publisher",
            "title",
            "language",
            "description",
            "subject",
        ]
        self.path = Path(path)
        self.name = self.path.name
        self.stem = self.path.stem
        self.suffix = self.path.suffix
        self.zipfile = zipfile.ZipFile(self.path)
        self.metadata = []
        self.find_metadata()

    def __str__(self):
        """
        Format to string representation.

        Returns:
            str: string representation of instance.
        """
        return f"EpubMeta({str(self.path)})"

    def get_opf(self):
        """
        Get the .opf file within the ebook archive.

        Raises:
            MetadataError: If it cannot parse metadata file

        Returns:
            (str): the path to the .opf file.
        """
        for fname in self.zipfile.namelist():
            if fname.endswith(".opf"):
                return fname
        raise MetadataError

    def find_metadata(self):
        """
        Find metadata within the ebook archive file.

        Returns:
            dict: key,value pairs for ebook metadata
        """
        with self.zipfile as zfile:
            opf_file = self.get_opf()
            with zfile.open(opf_file, "r") as zfile:
                ztext = zfile.read()
                self.xpath_parse(ztext)
                self.pattern_parse(ztext)
        return self.metadata

    def pattern_parse(self, opf):
        """
        Parse .opf file for Metadata using regex. and xpath.

        Args:
            opf (str):  path to opf file
        """
        text = str(opf)
        metadata = []
        for tag in self.tags:
            pat1 = re.compile(f"<{tag}.*?>(.*)</{tag}", re.S | re.M)
            result = pat1.search(text)
            if result:
                groups = result.groups()
                if isinstance(groups, str):
                    record = (tag, groups)
                    metadata.append(record)
                else:
                    for group in groups:
                        record = (tag, group)
                        metadata.append(record)
        self.metadata += metadata

    def xpath_parse(self, opf):
        """
        Parse .opf file with xpath selectors.

        Args:
            opf (str): path to opf file to parse
        """
        root = ET.fromstring(opf)
        ns = {
            "dc": "http://purl.org/dc/elements/1.1/",
            "opf": "http://www.idpf.org/2007/opf",
            "xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "dcterms": "http://purl.org/dc/terms/",
        }
        metadata = []
        for tag in self.tags:
            matches = root.findall(tag, ns)
            records = [(tag, match.text) for match in matches]
            metadata += records
        self.metadata += metadata

    def get_metadata(self):
        """
        Extract and format metadata into a dictionary.

        Returns:
            dict: key,value pairs of metadata extracted.
        """
        self.metadata += path_meta(self.path)
        meta = {}
        for k, v in self.metadata:
            if "dc:" in k:
                k = k[3:]
            if k in meta:
                meta[k].append(v)
            else:
                meta[k] = [v]
        return meta


class PathDoesNotExistError(Exception):
    """
    Raise when ebook path does not exist.

    Args:
        Exception (Obj): Raises an Exception
    """

    pass


class UnsupportedFormatError(Exception):
    """
    Raise when ebook file format is unsupported.

    Args:
        Exception (Obj): Raises an Exception
    """

    pass


class MetadataFetcher:
    """Primary Entrypoint for extracting metadata from most ebook filetypes."""

    def __init__(self, path):
        """
        Construct the MetadataFetcher Class and return Instance.

        Args:
            path (str or path-like): The path to the ebook to extract from

        Raises:
            UnsupportedFormatError: When unknown format is encountered
        """
        self.path = Path(path)
        if self.path.suffix == ".epub":
            self.meta = Epub(self.path)
        elif self.path.suffix in [".azw3", "azw", "kfx", ".mobi"]:
            self.meta = Kindle(self.path)
        else:
            raise UnsupportedFormatError

    def get_metadata(self):
        """
        Call to start the extraction process.

        Returns:
            dict: Metadata keys and values embedded in the file.
        """
        return self.meta.get_metadata()

    @classmethod
    def get(cls, path):
        """
        Get metadata from ebook at specified path.

        Args:
            path (str or path-like): Path to ebook.

        Returns:
            dict: Metadata keys and values embedded in the file.
        """
        meta = cls(path)
        metadata = meta.get_metadata()
        return metadata


def get_metadata(path):
    """
    Extract metadata from ebooks.

    Args:
        path (str or path-like): Path to ebook file.

    Returns:
        dict: Metadata keys and values embedded in the file.
    """
    metadata = MetadataFetcher.get(path)
    return metadata


def format_output(book):
    """
    Format the output for printing to STDOUT.

    Args:
        book (str or path-like): Path to ebook file

    Returns:
        str: Text data to output to STDOUT
    """
    output = ""
    fields = [
        "filename",
        "path",
        "extension",
        "size",
        "author",
        "title",
        "publisher",
        "creator",
        "language",
        "contributor",
        "date",
    ]
    longest_line = 0
    longest_field = max([len(i) for i in fields])
    for field in fields:
        if field in book:
            extra_spaces = longest_field - len(field)
            line = (" " * extra_spaces) + "\t" + str(book[field][0]) + "\n"
            line = field.title() + line
            output += line
            if len(line) > longest_line:
                longest_line = len(line)
    output += "-" * longest_line + "\n"
    return output


class HeaderMissingError(Exception):
    """Raise HeaderMissingError."""

    pass


class MetadataError(HeaderMissingError):
    """Raise MetadataError."""

    pass


def path_meta(path):
    """
    Metadata extracted from the file and path names.

    Args:
        path (str): path to file

    Returns:
        dict: key, value pairs of metadata parsed.
    """
    if isinstance(path, str):
        path = Path(path)
    metadata = [
        ("filename", path.name),
        ("path", str(path)),
        ("extension", path.suffix),
        ("size", path.stat().st_size),
    ]
    return metadata


def reverse_tag_iter(block):
    """
    Decode tag names.

    Args:
        block (bytes): tag names

    Yields:
        str: tag name
    """
    end = len(block)
    while True:
        pgt = block.rfind(b">", 0, end)
        if pgt == -1:
            break
        plt = block.rfind(b"<", 0, pgt)
        if plt == -1:
            break
        yield block[plt: pgt + 1]
        end = plt


def getLanguage(langID, sublangID):
    """
    Get Language Standard.

    Args:
        langID (str): Landguage ID
        sublangID (str): Sublanguage ID

    Returns:
        str: Language encoding.
    """
    langdict = {
        9: {
            0: "en",
            1: "en",
            3: "en-au",
            40: "en-bz",
            4: "en-ca",
            6: "en-ie",
            8: "en-jm",
            5: "en-nz",
            13: "en-ph",
            7: "en-za",
            11: "en-tt",
            2: "en-gb",
            1: "en-us",
            12: "en-zw",
        },  # English
        16: {0: "it", 1: "it", 2: "it-ch"},  # Italian,  Italian (Switzerland)
        22: {0: "pt", 2: "pt", 1: "pt-br"},  # Portuguese,  Portuguese (Brazil)
        10: {
            0: "es",
            4: "es",
            44: "es-ar",
            64: "es-bo",
            52: "es-cl",
            36: "es-co",
            20: "es-cr",
            28: "es-do",
            48: "es-ec",
            68: "es-sv",
            16: "es-gt",
            72: "es-hn",
            8: "es-mx",
            76: "es-ni",
            24: "es-pa",
            60: "es-py",
            40: "es-pe",
            80: "es-pr",
            56: "es-uy",
            32: "es-ve",
        },  # Spanish
    }
    sublangID = 0 if not sublangID else sublangID
    try:
        lang = langdict[langID][sublangID]
    except KeyError:
        lang = "en"
    return lang
